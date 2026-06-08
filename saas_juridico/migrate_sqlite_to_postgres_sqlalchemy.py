#!/usr/bin/env python3
"""Migração robusta SQLite -> Postgres usando SQLAlchemy.

Este script reflete o schema do arquivo SQLite, cria as tabelas no Postgres
e copia os registros tabela-a-tabela. Uso:

  python migrate_sqlite_to_postgres_sqlalchemy.py --sqlite lexflow.db --database-url "postgresql://..."

Observação: requer `SQLAlchemy` e `psycopg[binary]` instalados.
"""
import os
import argparse
from sqlalchemy import create_engine, MetaData, select, insert
from sqlalchemy.exc import SQLAlchemyError


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sqlite', default='lexflow.db', help='Caminho do arquivo SQLite')
    parser.add_argument('--database-url', default=os.environ.get('DATABASE_URL'), help='URL do Postgres')
    args = parser.parse_args()

    if not args.database_url:
        raise SystemExit('DATABASE_URL não definido. Exporte a variável ou use --database-url')
    if not os.path.exists(args.sqlite):
        raise SystemExit(f'Arquivo SQLite não encontrado: {args.sqlite}')

    sqlite_url = f'sqlite:///{os.path.abspath(args.sqlite)}'

    # Engines
    sqlite_engine = create_engine(sqlite_url, future=True)
    pg_engine = create_engine(args.database_url, future=True)

    sqlite_meta = MetaData()
    try:
        sqlite_meta.reflect(bind=sqlite_engine)
    except Exception as e:
        raise SystemExit(f'Erro ao refletir o schema SQLite: {e}')

    if not sqlite_meta.tables:
        print('Nenhuma tabela encontrada no SQLite; nada a fazer.')
        return

    # Criar tabelas no Postgres
    pg_meta = sqlite_meta
    try:
        pg_meta.create_all(bind=pg_engine)
        print('Tabelas criadas/no Postgres verificadas.')
    except SQLAlchemyError as e:
        raise SystemExit(f'Erro ao criar tabelas no Postgres: {e}')

    # Copiar dados
    with sqlite_engine.connect() as sconn, pg_engine.connect() as pconn:
        trans = pconn.begin()
        try:
            for table in sqlite_meta.sorted_tables:
                print(f'Migrando tabela: {table.name}')
                rows = sconn.execute(select(table)).all()
                if not rows:
                    print(f'  tabela {table.name}: sem registros, pulando')
                    continue
                # convert Row objects to dicts
                to_insert = [dict(r._mapping) for r in rows]
                # insert in chunks
                chunk = 500
                inserted = 0
                for i in range(0, len(to_insert), chunk):
                    batch = to_insert[i:i+chunk]
                    pconn.execute(insert(table), batch)
                    inserted += len(batch)
                print(f'  tabela {table.name}: {inserted} registros migrados')
            trans.commit()
            print('Migração concluída com sucesso.')
        except Exception as e:
            trans.rollback()
            raise


if __name__ == '__main__':
    main()
