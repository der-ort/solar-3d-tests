import Image from "next/image";
import styles from "./page.module.css";
import SpaceExplorer from "@/components/SpaceExplorer/SpaceExplorer";


export default function Home() {
  return (<>
     <main className={styles.main}>
          
          <p className={styles.description}>
          S O L A R<br />
          This is a test to see if the 3D solar system can be used like a normal component.
          <br />
          </p>
       <SpaceExplorer />
    </main>
    </>
    );
}
