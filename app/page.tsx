"use client";

import Main from "./components/Main";


export default function Home() {
  return (
    <Main tabsOptions={["Calls", "Lead", "Internet", "Needs Quote", "Has Quote", "Signed"]}/>
  )
}
