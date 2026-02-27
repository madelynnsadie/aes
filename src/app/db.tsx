"use server"

import * as fs from "fs";
import path from "path";

export interface Transaction {
    title: string;
    description?: string;
    amount: number;
    date: Date;
}

export interface Unit {
    symbol: string;
    name: string;
}

export interface Settings {
    unit: Unit;
}

export interface DB {
    settings: Settings;
    transactions: Transaction[];
}

let dbPath: string;

let hasInit = false;
const init = () => {
    dbPath = process.env.AES_DB ?? "/data/db.json"
};

const baseDB: DB = {
    settings: {
        unit: {
            symbol: "£",
            name: "Pound"
        },
    },
    transactions: []
};

const ensureFiles = () => {
    const writeBase = () => {
        fs.writeFileSync(dbPath, JSON.stringify(baseDB))
    };

    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
        writeBase();
    } else {
        try {
            JSON.parse(fs.readFileSync(dbPath).toString())
        } catch {
            writeBase();
        }
    }
}

function calculateTotal(transactions: { amount: number }[]) {
    let sum = 0;

    transactions.forEach((t) => sum += t.amount);

    return sum;
}

export type DBResponse = DB & { total: number };

export async function readDB(): Promise<DBResponse> {
    if (!hasInit) init();

    ensureFiles();

    const parse: DB = JSON.parse(fs.readFileSync(dbPath).toString());

    return { ...parse, total: calculateTotal(parse.transactions) };
}

function writeDB(db: DB) {
    if (!hasInit) init();

    ensureFiles();

    fs.writeFileSync(dbPath, JSON.stringify(db));
}

export async function addTransaction(transaction: Transaction) {
    const current = await readDB();

    writeDB({
        ...current,
        transactions: [
            ...current.transactions,
            transaction
        ]
    });
}