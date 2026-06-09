import os

import field_crypto
import psycopg


IDENTITY_FIELDS = {
    "users": ["name", "email"],
    "organizations": ["name"],
}


def main() -> None:
    dsn = os.environ["DATABASE_URL"]
    updated = 0
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            for table, columns in IDENTITY_FIELDS.items():
                column_list = ", ".join(columns)
                cur.execute(f"SELECT id, {column_list} FROM {table}")
                for row in cur.fetchall():
                    row_id = row[0]
                    assignments = []
                    values = []
                    for column, value in zip(columns, row[1:]):
                        if not isinstance(value, str):
                            continue
                        plain = field_crypto.decrypt_str(value)
                        if plain != value:
                            assignments.append(f"{column} = %s")
                            values.append(plain)
                    if assignments:
                        values.append(row_id)
                        cur.execute(f"UPDATE {table} SET {', '.join(assignments)} WHERE id = %s", values)
                        updated += 1
        conn.commit()
    print(f"identity-normalized rows={updated}")


if __name__ == "__main__":
    main()
