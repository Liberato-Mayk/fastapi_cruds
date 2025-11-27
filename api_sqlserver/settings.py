from dotenv import load_dotenv
import os

load_dotenv()
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
server = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")