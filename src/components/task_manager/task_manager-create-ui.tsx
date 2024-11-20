"use client";

import { useTaskManagerProgram } from "./task_manager-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import { FormEvent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { Loader } from "../ui/ui-layout";
import { IReceivedTaskData } from "./types";
import { BN } from "bn.js";
import Link from "next/link";

export function TaskManagerCreate({
  currentTask,
  currentDescription,
  currentPriority,
  currentAddedDate,
  currentDueDate,
  currentIsCompleted,
  operation,
}: IReceivedTaskData) {
  const { createEntry, updateEntry } = useTaskManagerProgram();
  const { publicKey } = useWallet();
  const [task, setTask] = useState<string>(currentTask);
  const [description, setDescription] = useState<string>(currentDescription);
  const [priority, setPriority] = useState<string>(currentPriority);
  const [dueDate, setDueDate] = useState<Date | null>(currentDueDate);
  const [isComplete, setIsComplete] = useState<boolean>(currentIsCompleted);

  const handleSubmit = async () => {
    if (!publicKey) {
      toast.error("Connect your wallet !");
      return;
    }
    if (!priority || (priority != "1" && priority != "2" && priority != "3")) {
      toast.error("Set Priority 1 for highest,2 for medium or 3 for lowest !");
      return;
    }
    if (!dueDate) {
      toast.error("Select Due date !");
      return;
    }
    try {
      if (operation === "creating") {
        await createEntry.mutateAsync({
          title: task,
          description,
          priority: parseInt(priority),
          addedDate: new BN(Math.floor(Date.now() / 1000)),
          dueDate: new BN(Math.floor(dueDate.getTime() / 1000)),
          isComplete,
          owner: publicKey,
        });
      }
      if (operation === "editing") {
        await updateEntry.mutateAsync({
          title: task,
          description,
          priority: parseInt(priority),
          addedDate: currentAddedDate
            ? new BN(currentAddedDate.getTime() / 1000)
            : new BN(Math.floor(new Date(Date.now()).getTime() / 1000)),
          dueDate: new BN(Math.floor(dueDate.getTime() / 1000)),
          isComplete,
          owner: publicKey,
        });
      }
      setTask("");
      setDescription("");
      setPriority("");
      setDueDate(null);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Something went wrong !";
      console.log(errMsg);
      toast.error(errMsg);
    }
  };
  const warning = (e: FormEvent<HTMLInputElement>, title: string) => {
    const currentLength = e.currentTarget.value.length;
    if (currentLength > (title === "title" ? 31 : 189)) {
      toast.error("Max length exceeds !");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto my-2">
      <input
        disabled={operation === "editing"}
        title={operation === "editing" ? "Can't edit due to PDA contraint" : ""}
        type="text"
        placeholder="Task title - once created wouldn't be able to edit"
        value={task}
        maxLength={32}
        onInput={(e) => warning(e, "title")}
        onChange={(e) => setTask(e.target.value)}
        className={`w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 ${
          operation === "editing" ? "text-black" : ""
        }`}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={description}
        maxLength={190}
        onInput={(e) => warning(e, "description")}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
      />
      <input
        type="text"
        placeholder="Priority - 1-Highest | 2-Medium | 3-Low"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
      />
      <div className="w-full mb-3">
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="MMMM d, yyyy"
          placeholderText="Select a due date"
          className=" w-[23rem] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full py-3 px-6 font-semibold text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 active:scale-95"
      >
        {createEntry.isPending || updateEntry.isPending ? (
          <div className="h-6 flex items-center">
            <Loader width={22} height={22} />
          </div>
        ) : operation === "creating" ? (
          "Create Task"
        ) : operation === "editing" ? (
          "Update Task"
        ) : (
          " No Operation"
        )}
      </button>
      {operation === "editing" && (
        <Link href="/task_manager" className="mt-6 text-yellow-800">
          Cancel
        </Link>
      )}
    </div>
  );
}
