import Image from "next/image";
import styles from "./page.module.css";
import SpaceExplorer from "@/components/SpaceExplorer";

export default function Home() {
  return (
    <main className={styles.main}>
      <SpaceExplorer />
    </main>
    );
}
