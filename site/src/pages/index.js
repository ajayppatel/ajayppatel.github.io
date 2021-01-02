import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default function Home() {
  return (
    <div style={{ color: `purple`}}>
      <Link to="/about/">About</Link>
      <br/>
      <Link to="/contact/">Contact</Link>
      <Header headerText="learning gatsby" />
      <p>What a world.</p>
      <img src="https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/64619480_1622651367872139_5041055900463267840_n.jpg?_nc_cat=111&ccb=2&_nc_sid=09cbfe&_nc_ohc=K-aA_6Zl4D8AX9yt3qC&_nc_ht=scontent-iad3-1.xx&oh=28ff20d169fcd802d061d1129eeb7b41&oe=6015E3D1" alt="" />
    </div>
  );
}
