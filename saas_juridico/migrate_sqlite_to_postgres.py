#!/usr/bin/env python3
"""Migra dados de lexflow.db (SQLite) para PostgreSQL.

Uso:
  - Configure `DATABASE_URL` no `.env` ou exporte no ambiente.
  - Suba o Postgres via `docker compose up -d` (service `db`).
  - Execute: `python migrate_sqlite_to_postgres.py --sqlite lexflow.db`

Observações:
  - Preserva valores de PK quando possível.
  - Ignora tabelas internas do SQLite (sqlite_*)
"""
import os
import sqlite3
import argparse
from urllib.parse import urlparse

try:
    import psycopg
except Exception as e:
    raise SystemExit("psycopg não encontrado. Instale com: pip install psycopg[binary]")


def get_tables_sqlite(conn):
    cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    return [row[0] for row in cur.fetchall()]


def get_columns_sqlite(conn, table):
    cur = conn.execute(f"PRAGMA table_info('{table}')")
    return [row[1] for row in cur.fetchall()]


def copy_table(sqlite_conn, pg_conn, table):
    cols = get_columns_sqlite(sqlite_conn, table)
    if not cols:
        return
    placeholders = ','.join(['%s'] * len(cols))
    col_list = ','.join([f'"{c}"' for c in cols])

    rows = list(sqlite_conn.execute(f"SELECT * FROM \"{table}\"").fetchall())
    if not rows:
        print(f"Tabela {table}: sem registros, pulando.")
        return

    with pg_conn.cursor() as cur:
        inserted = 0
        for row in rows:
            values = list(row)
            sql = f'INSERT INTO "{table}" ({col_list}) VALUES ({placeholders})'
            try:
                cur.execute(sql, values)
                inserted += 1
            except Exception as e:
                print(f"Falha ao inserir em {table}: {e}")
        print(f"Tabela {table}: {inserted} registros migrados.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sqlite', default='lexflow.db', help='Caminho do arquivo SQLite (default: lexflow.db)')
    parser.add_argument('--database-url', default=os.environ.get('DATABASE_URL'), help='URL do Postgres (ou via env DATABASE_URL)')
    args = parser.parse_args()

    if not args.database_url:
        raise SystemExit('DATABASE_URL não definido. Exporte a variável ou use --database-url')

    if not os.path.exists(args.sqlite):
        raise SystemExit(f'Arquivo SQLite não encontrado: {args.sqlite}')

    sqlite_conn = sqlite3.connect(args.sqlite)
    sqlite_conn.row_factory = sqlite3.Row

    # Conectar no Postgres
    pg = psycopg.connect(args.database_url)
    pg.autocommit = False

    try:
        tables = get_tables_sqlite(sqlite_conn)
        print(f"Tabelas encontradas no SQLite: {tables}")

        # Ordenação simples: tables without FKs first could be improved
        for table in tables:
            copy_table(sqlite_conn, pg, table)

        pg.commit()
        print("Migração concluída com sucesso.")
    except Exception as e:
        pg.rollback()
        raise
    finally:
        sqlite_conn.close()
        pg.close()


if __name__ == '__main__':
    main()
