import psycopg
from psycopg.rows import dict_row

from src.config import Config


def get_connection():
    return psycopg.connect(
        host=Config.POSTGRES_HOST,
        port=Config.POSTGRES_PORT,
        dbname=Config.POSTGRES_DB,
        user=Config.POSTGRES_USER,
        password=Config.POSTGRES_PASSWORD,
        row_factory=dict_row,
    )
