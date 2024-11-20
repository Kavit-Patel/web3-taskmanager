"use client";

import { useEffect, useState } from "react";
import { useTaskManagerProgram } from "../task_manager/task_manager-data-access";
import Link from "next/link";
import { Loader } from "../ui/ui-layout";
import { ITask, ITasks } from "./types";
import BN from "bn.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";

export function TaskListDisplay() {
  const { accounts: accountsTasks } = useTaskManagerProgram();
  const { publicKey } = useWallet();
  const [tasks, setTasks] = useState<ITasks[] | null>(null);
  useEffect(() => {
    if (!accountsTasks.isLoading && !accountsTasks.data) {
      accountsTasks.refetch();
    }
    accountsTasks.data &&
      setTasks(
        accountsTasks.data.filter(
          (element) =>
            element.account.owner.toBase58() === publicKey?.toBase58()
        )
      );
  }, [accountsTasks.data, accountsTasks.data?.length]);

  if (accountsTasks.isLoading) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex justify-center items-center">
        <Loader width={120} height={120} />
      </div>
    );
  }
  if (accountsTasks.isError) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex justify-center items-center">
        {accountsTasks.error.message}
      </div>
    );
  }
  return (
    <div className="">
      {tasks && tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <div className="w-full h-96 flex justify-center items-center">
          <span>
            You Don't have any tasks !{" "}
            <Link href="/task_manager" className="text-yellow-400">
              Create One
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}

export function TaskList({ tasks }: { tasks: ITasks[] }) {
  const router = useRouter();
  const { completeEntry, deleteEntry } = useTaskManagerProgram();
  const [isPerforming, setisPerforming] = useState<string | null>(null);
  const handleEdit = (task: ITask) => {
    router.push(
      `/task_manager?data=${encodeURIComponent(
        JSON.stringify({
          ...task,
          addedDate: readableDate(task.addedDate),
          dueDate: readableDate(task.dueDate),
        })
      )}`
    );
  };

  const handleDelete = async (task: ITask) => {
    setisPerforming(task.title);
    try {
      await deleteEntry.mutateAsync({ ...task });
      setisPerforming(null);
    } catch (error) {
      setisPerforming(null);
      console.log("Deletion error", error);
      toast.error(
        (error instanceof Error && error.message) || " Deletion error occured !"
      );
    }
  };

  const handleComplete = async (task: ITask) => {
    setisPerforming(task.title);
    try {
      await completeEntry.mutateAsync({
        ...task,
        isComplete: !task.isComplete,
      });
      setisPerforming(null);
    } catch (error) {
      setisPerforming(null);
      console.log("complete task error ,", error);
      toast.error(
        (error instanceof Error && error.message) ||
          " Completion error occured !"
      );
    }
  };

  const readableDate = (givenDate: BN) =>
    new Date(Math.floor(givenDate.toNumber() * 1000));

  return (
    <div className="p-6 sm:p-10 bg-gray-700 h-[calc(100vh-150px)] mt-4 rounded-lg overflow-y-auto">
      <div className=" relative flex items-center mb-8">
        <div className="text-4xl  font-bold text-center flex-1 ">
          <div className="">Task List</div>
        </div>
        <Link
          href="/task_manager"
          className=" absolute right-0 font-semibold border-2 border-green-500 bg-green-400 px-2 py-0.5 rounded-md text-gray-600 transition-all hover:bg-green-500 hover:border-green-600 hover:text-gray-800 active:scale-95"
        >
          Add +
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks
          .sort((a, b) => {
            const dateA = new Date(readableDate(a.account.addedDate)).getTime();
            const dateB = new Date(readableDate(b.account.addedDate)).getTime();
            return dateB - dateA; // Sort by descending order (latest first)
          })
          .map((task) => {
            const {
              title,
              description,
              priority,
              addedDate,
              dueDate,
              isComplete,
            } = task.account;
            return (
              <div
                key={task.account.title}
                className="bg-white rounded-lg shadow-md p-6 border-t-4"
                style={{
                  borderTopColor: isComplete ? "green" : "blue",
                }}
              >
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <div className="text-gray-600 mb-4 h-24  w-96 py-2 overflow-y-auto custom-scrollbar">
                  {description}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    <span className="font-medium">Priority:</span>{" "}
                    {priority === 1
                      ? "High"
                      : priority === 2
                      ? "Medium"
                      : "Low"}
                  </p>
                  <p>
                    <span className="font-medium">Added Date:</span>{" "}
                    {readableDate(addedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Due Date:</span>{" "}
                    {readableDate(dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(task.account)}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md shadow-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    disabled={deleteEntry.isPending}
                    onClick={() => handleDelete(task.account)}
                    className="px-4 py-2 h-10 w-24 bg-red-500 text-white font-medium rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    {deleteEntry.isPending &&
                    isPerforming === task.account.title ? (
                      <div className=" flex items-center">
                        <Loader width={22} height={22} />
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button
                    disabled={completeEntry.isPending}
                    onClick={() => handleComplete(task.account)}
                    className={`px-4 py-2 h-10 w-48 ${
                      isComplete
                        ? "bg-green-500"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white font-medium rounded-md shadow-md transition`}
                  >
                    {completeEntry.isPending &&
                    isPerforming === task.account.title ? (
                      <div className=" flex items-center">
                        <Loader width={22} height={22} />
                      </div>
                    ) : isComplete ? (
                      "Completed"
                    ) : (
                      "Mark as Completed"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
