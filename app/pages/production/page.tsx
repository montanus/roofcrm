"use client";

import Main from "../../components/Main";

export default function Home() {
  return (
    <Main tabsOptions={["Signed","Permiting", "Ordering", "In Progress", "Inspection","Balance Due"]}/>
  )
}
