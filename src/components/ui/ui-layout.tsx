"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ReactNode, Suspense, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

import { AccountChecker } from "../account/account-ui";
import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from "../cluster/cluster-ui";
import { WalletButton } from "../solana/solana-provider";
import { FaWallet } from "react-icons/fa";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const [menu, showMenu] = React.useState<boolean>(false);

  return (
    <div className="h-full flex flex-col mx-auto min-h-screen">
      <div className="navbar bg-base-300 text-neutral-content md:flex-row space-y-2 md:space-y-0">
        <div className="h-full">
          <Link
            className="btn btn-ghost normal-case text-sm md:text-3xl"
            href="/"
          >
            <img className="h-4 md:h-6" alt="Logo" src="/logo.png" />
          </Link>
          <ul className="menu menu-horizontal px-0 md:px-1 md:space-x-2">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link
                  className={pathname.startsWith(path) ? "active" : ""}
                  href={path}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => showMenu((prev) => !prev)}
          className="h-full w-8 md:hidden flex self-center text-orange-400 text-xl ml-auto"
        >
          <FaWallet />
        </button>
        {menu && (
          <div className="flex md:hidden gap-4 w-full absolute justify-end px-5 top-14">
            <WalletButton />
            <ClusterUiSelect />
          </div>
        )}
        <div
          className={`hidden justify-between w-full md:flex-1 md:flex md:justify-end md:w-fit space-x-2`}
        >
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <div className="flex-grow mx-4 lg:mx-auto">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content self-end">
        <aside>
          <p>
            Developed by{" "}
            <a
              className="link hover:text-white"
              href="https://github.com/kavit-patel"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kavit Patel @ https://github.com/kavit-patel
            </a>
          </p>
        </aside>
      </footer>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || "Save"}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="md:hero py-[12px] md:py-[64px]">
      <div className="md:hero-content text-center">
        <div className="">
          {typeof title === "string" ? (
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              {title}
            </h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className=" py-2 md:py-6 text-xs">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={"text-center"}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={"View Transaction"}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}

export function Loader({ width, height }: { width: number; height: number }) {
  return (
    <div className="w-full flex justify-center">
      <div
        style={{ width: `${width}px`, height: `${height}px` }}
        className=" border-b-2 border-orange-500 rounded-full animate-spin"
      ></div>
    </div>
  );
}
