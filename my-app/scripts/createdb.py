import sqlite3
import json 

conn = sqlite3.connect('../db/invoices.sqlite')
conn.row_factory = sqlite3.Row

scripts = [
    """
    create table if not exists categories
    (
        id text,
        name text,
        category_id text,
        primary key(id)
    )
    """,
    """
    create table if not exists items
    (
        id text,
        name text,
        category_id text,
        primary key(id)
    )
    """,
    """
    create table if not exists customers
    (
        id text,
        name text,
        address text,
        contact text,
        currency_id text,
        primary key(id)
    )
    """,
    """
    create table if not exists currencies
    (
        id text,
        name text,
        symbol text,
        primary key(id)
    )
    """,
    """
    create table if not exists sales
    (
        id text,
        company_id text,
        account_id text,
        customer_id text,
        place text,
        number int,
        date text,
        currency_id text,
        total decimal,
        reference text,
        confirmed int,        
        primary key(id)
    )
    """,
    """
    create table if not exists saleitems
    (
        id text,
        sale_id text,
        item_id text,
        description text,
        quantity int,
        price decimal,
        primary key(id)
    )
    """,
    """
    create table if not exists companies
    (
        id text,
        name text,
        address text,
        crn text,
        trn text,
        rep text,
        contact text,
        mobile text,
        email text,
        primary key(id)
    )
    """,
    """
    create table if not exists accounts
    (
        id text,
        label text,
        bank_name text,
        bank_address text,
        bank_swift text,
        account_name text,
        account_iban text,
        account_address text,
        primary key(id)
    )
    """,
    ]

for s in scripts:
    conn.execute(s)
conn.commit()

#migrate from invoices json
srcFile = r'I:\Box\Box Sync\main\invoices\Invoices\data.json'
with open(srcFile, 'r', encoding='utf-8') as f:
    data = json.loads(f.read())

#migration
categories = [{'id': '1', 'name': 'Advertising', 'category_id': None}]
items = [{'id': s['id'], 'name': s['name']['en'], 'category_id': '1'} for s in data['services']]
accounts = [{'id': s['id'], 'label': s['label'], 'bank_name': s['bank']['en'], 'bank_address': s['address']['en'], 'bank_swift': s['swift'], 'account_name': s['name']['en'], 'account_iban': s['iban'], "account_address": "2277 Al Adel - Al Jarudiyah Dist. AL QATIF 32652 - 8973, Eastern Province, Saudi Arabia"} for s in data['accounts']]
currencies = [
    {
        "id": "1",
        "name": "USD",
        "symbol": "&dollar;"
    },
    {
        "id": "2",
        "name": "EUR",
        "symbol": "&euro;"
    },
    {
        "id": "3",
        "name": "GBP",
        "symbol": "&pound;"
    }
]

customers = [{"id": s['id'], "name": s['name'], "address": s['address'], "contact": s['contact'], "currency_id": '1'} for s in data['clients']]
companies = [{'id': s['id'], 'name': s['name']['en'], 'address': s['address']['en'], 'crn': s['crn'], 'trn': s['trn'], 'rep': s['rep']['en'], 'contact': s['contact'], 'email': s['email']} for s in data['companies']]
sales = [{"id": s['id'],
            "number": s['number'],
            "customer_id": s['client'],
            "place": s['place'] if 'place' in s else None,
            "date": s['date'],            
            "reference": s['month'] if 'place' in s else None,
            "account_id": s['account'],
            "company_id": s['company'],
            "currency_id": "1",
            "total": s["amount"]['en'],
            "confirmed": 1} for s in data['invoices']]

saleitems = [{"id": s['id'],
            "sale_id": s['id'],
            "item_id": s["service"],
            "description": s['from'] + " to " + s['to'],            
            "quantity": 1,
            "price": s["amount"]['en']} for s in data['invoices']]


#insert
conn.executemany("insert or replace into categories (id, name, category_id) values (:id, :name, :category_id)", categories)
conn.executemany("insert or replace into items (id, name, category_id) values (:id, :name, :category_id)", items)
conn.executemany("insert or replace into currencies (id, name, symbol) values (:id, :name, :symbol)", currencies)
conn.executemany("insert or replace into customers (id, name, address, contact, currency_id) values (:id, :name, :address, :contact, :currency_id)", customers)
conn.executemany("insert or replace into accounts(id, label, bank_name, bank_address, bank_swift, account_name, account_iban, account_address) values(:id, :label, :bank_name, :bank_address, :bank_swift, :account_name, :account_iban, :account_address)", accounts)

conn.executemany("insert or replace into companies (id, name, address, crn, trn, rep, contact, email) values (:id, :name, :address, :crn, :trn, :rep, :contact, :email)", companies)
conn.executemany("insert or replace into sales (id, number, customer_id, place, date, reference, account_id, company_id, currency_id, total, confirmed) values (:id, :number, :customer_id, :place, :date, :reference, :account_id, :company_id, :currency_id, :total, :confirmed)", sales)

conn.executemany("insert or replace into saleitems (id, sale_id, item_id, description, quantity, price) values (:id, :sale_id, :item_id, :description, :quantity, :price)", saleitems)

conn.commit()