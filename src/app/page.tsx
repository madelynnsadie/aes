"use client"

import { addTransaction, DBResponse, readDB, Transaction } from "./db";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowDown } from "react-icons/fa";

export default function Home() {

  const [db, setDB] = useState<DBResponse>({
    settings: {
      unit: {
        symbol: "£",
        name: "Pound"
      },
    },
    transactions: [],
    total: 0
  });

  const updateDB = async () => {
    setDB(await readDB());
  };

  useEffect(() => {
    updateDB();
  }, []);

  const [expanded, setExpanded] = useState<boolean>(false);

  const [newForm, setNewForm] = useState<Partial<Omit<Transaction, "amount"> & { amount: string }>>({});

  const submit = () => {
    if (Number.isNaN(Number(newForm.amount))) {
      setNewForm((old) => ({ ...old, amount: "" }));
      return;
    } else {
      addTransaction({
        ...newForm,
        amount: Number(newForm.amount),
        date: new Date()
      } as any);
    }
    setNewForm({});
    setExpanded(false);
    updateDB();
  }

  return (
    <div className="flex flex-col items-center justify-center text-xl bg-mauve-900 text-rose-200 w-screen min-h-screen p-4 px-24 lowercase">
      <h1 className="text-2xl text-rose-300 absolute top-4 bg-mauve-950/25 rounded-full p-2 px-8">~ {db.settings.unit.symbol}{Math.round(db.total)} ~</h1>

      <div className="w-full h-full mt-16 mx-96 bg-mauve-950/25 rounded-xl flex flex-col items-start justify-start p-4 gap-4">
        <div className={`w-full ${expanded ? "h-84" : "fit items-center"} bg-mauve-950/20 rounded-md flex flex-col gap-2 p-2 px-4`}>
          <div className="flex flex-row items-center w-full justify-start gap-3">
            <div onClick={() => setExpanded((last) => !last)} className="cursor-pointer text-rose-200/75">
              {expanded ? <FaArrowDown /> : <FaArrowRight />}
            </div>
            <h1 className="text-xl">new transaction</h1>
          </div>
          {expanded && <div className="h-1 border-b-5 border-mauve-950/40 rounded-xl" />}
          {expanded &&
            <div className="flex flex-col grow w-full gap-2">
              <input
                type="text"
                className="appearance-none outline-none focus:ring-0 bg-mauve-950/25 p-2 px-4 rounded-lg text-md placeholder-mauve-700/75"
                value={newForm.title ?? ""}
                onChange={(e) => setNewForm((old) => ({ ...old, title: e.target.value }))}
                placeholder="title"
              />
              <input
                type="text"
                className="appearance-none outline-none focus:ring-0 bg-mauve-950/25 p-2 px-4 rounded-lg text-md placeholder-mauve-700/75"
                value={newForm.description ?? ""}
                onChange={(e) => setNewForm((old) => ({ ...old, description: e.target.value }))}
                placeholder="description *"
              />
              <input
                type="text"
                className="appearance-none outline-none focus:ring-0 bg-mauve-950/25 p-2 px-4 rounded-lg text-md placeholder-mauve-700/75"
                value={newForm.amount ?? ""}
                onChange={(e) => setNewForm((old) => ({ ...old, amount: e.target.value.replaceAll(/[^0-9\.-]/g, "") }))}
                placeholder="amount"
              />

              <div className="mt-2 rounded-lg bg-mauve-950/25 p-2 px-4 w-fit text-rose-300" onClick={() => submit()}>
                <h1>submit</h1>
              </div>
            </div>
          }
        </div>
        <div className="w-full h-full flex flex-col gap-2 overflow-scroll">
          {db.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t =>
            <div key={t.amount + t.title + t.date} className={`w-full h-42 ${t.amount >= 0 ? "bg-green-950/40" : "bg-rose-950/20"} rounded-md flex flex-row gap-2 p-2`}>
              <div className="bg-mauve-950/20 rounded-sm flex items-center justify-center aspect-square h-38 w-38">
                <h1 className="text-3xl">{db.settings.unit.symbol}{t.amount > 0 ? t.amount : t.amount * -1}</h1>
              </div>
              <div className="flex flex-col grow gap-2 m-4 justify-between py-2">
                <h1 className="text-rose-200/80 text-xl">{t.title}</h1>
                {t.description && <h1 className="text-rose-200/80 text-lg">{t.description}</h1>}
              </div>
            </div>)}
        </div>
      </div>
    </div>
  );
}
