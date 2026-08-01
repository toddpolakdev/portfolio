import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import styles from "../../admin.module.css";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.crumb}>
          <Link href="/admin/projects">
            <FiArrowLeft size={11} /> projects
          </Link>{" "}
          / new
        </p>
        <h1 className={styles.h1}>New project</h1>
        <p className={styles.sub}>
          Save as a draft first if you want to write it up before it goes live.
        </p>
      </header>

      <ProjectForm isNew />
    </>
  );
}
