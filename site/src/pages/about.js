import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default function About() {
  return (
    <div style={{ color: `teal` }}>
      <Link to="/">Home</Link>
      <Header headerText="About Ajay"/>
      <Header headerText="this so modular"/>
      <p>Such wow. Very React.</p>
    </div>
  )
}
