import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

type DialogProps<T extends object> = {
  title: ((value: T) => React.ReactNode) | React.ReactNode;
  body: ((value: T, toggle: () => void) => React.ReactNode) | React.ReactNode;
  onYes: (value: T) => Promise<void>;
  children: (setData: (data: T) => void, toggle: () => void) => React.ReactNode;
  disableButtons?: boolean;
};

export default function TwDialog<T extends object>({
  title,
  body,
  onYes,
  children,
  disableButtons = false,
}: DialogProps<T>) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const cancelButtonRef = useRef(null);

  return (
    <>
      {data !== null ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="z-1000 relative"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="bg-gray-500 fixed inset-0 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="bg-red-100 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="text-red-600 h-6 w-6"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-gray-900 text-base font-semibold leading-6"
                          >
                            {typeof title === "function" ? title(data) : title}
                          </Dialog.Title>
                          <div className="mt-2">
                            {typeof body === "function" ? body(data, () => setOpen(i => !i)) : body}
                          </div>
                        </div>
                      </div>
                    </div>
                    {disableButtons ? null : (
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          className="hover:bg-red-500 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                          onClick={async () => {
                            await onYes(data);
                            setOpen(false);
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="text-gray-900 ring-gray-300 hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto"
                          onClick={() => setOpen(false)}
                          ref={cancelButtonRef}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : null}
      {children(
        (data) => setData(data),
        () => setOpen((i) => !i),
      )}
    </>
  );
}
