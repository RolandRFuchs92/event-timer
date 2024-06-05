type HideSidebarSwitcherType = {
  setIsSidebarOpen: (arg0: boolean) => void;
  isSidebarOpen: string | boolean | undefined;
};

export default function HideSidebarSwitcher({
  isSidebarOpen,
  setIsSidebarOpen,
}: HideSidebarSwitcherType) {
  return (
    <li className="block">
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${
          !!isSidebarOpen ? "bg-primary" : "bg-stroke"
        }`}
      >
        <input
          type="checkbox"
          onChange={() => setIsSidebarOpen(!isSidebarOpen)}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            !!isSidebarOpen && "!right-[3px] !translate-x-full"
          }`}
        >
          <span className="dark:hidden">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path
                  d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                  fill="#000"
                />
              </svg>
            </svg>
          </span>
          <span className="hidden dark:inline-block">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
                fill="#000"
              />
            </svg>
          </span>
        </span>
      </label>
    </li>
  );

  // return (
  //   <li className="block">
  //     <label
  //       className={`relative m-0 block h-7.5 w-7.5 rounded-full ${
  //         isSidebarOpen === true ? "bg-primary" : "bg-purple-500"
  //       }`}
  //     >
  //       {/* <div className="absolute right-1/2  top-1/2 flex">
  //         <TVIcon />
  //       </div> */}

  //       <input
  //         type="checkbox"
  //         onChange={() => {
  //           setIsSidebarOpen(!isSidebarOpen);
  //         }}
  //         className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
  //       />
  //     </label>
  //   </li>
  // );
}
