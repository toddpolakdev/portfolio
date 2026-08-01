"use client";

import { useActionState } from "react";
import styles from "../admin.module.css";
import Repeater from "../Repeater";
import SaveBar from "../SaveBar";
import { saveSectionAction, type ActionState } from "@/app/actions/admin";
import type { Section } from "@/types/types";

const INITIAL: ActionState = { status: "idle" };

/** `name|url` per line — matches how the action parses skill tags back out. */
function tagsToText(tags: { name: string; url: string }[]) {
  return tags.map((t) => `${t.name} | ${t.url}`).join("\n");
}

export default function SectionForm({ section }: { section: Section }) {
  const [state, formAction] = useActionState(saveSectionAction, INITIAL);
  const type = section.type || section.id;

  return (
    <form action={formAction} className={styles.card}>
      <input type="hidden" name="id" value={section.id} />
      <input type="hidden" name="type" value={type} />

      <div className={styles.cardHead}>
        <span className={styles.cardTitle}>{section.id}</span>
        <span className={styles.cardMeta}>type: {type}</span>
      </div>

      <div className={`${styles.cardBody} ${styles.form}`}>
        <div className={styles.grid2}>
          <label className={styles.field}>
            <span className={styles.label}>title</span>
            <input
              className={styles.input}
              name="title"
              defaultValue={section.title}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>order</span>
            <input
              className={styles.input}
              name="order"
              type="number"
              defaultValue={section.order ?? 0}
            />
          </label>
        </div>

        {(type === "hero" || type === "about" || type === "contact") && (
          <>
            <label className={styles.field}>
              <span className={styles.label}>subtitle</span>
              <input
                className={styles.input}
                name="subtitle"
                defaultValue={section.subtitle ?? ""}
                placeholder="Web Developer | Project+ Certified"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>description</span>
              <textarea
                className={styles.textarea}
                name="description"
                defaultValue={section.description ?? ""}
                placeholder="One paragraph shown under the heading."
              />
            </label>
          </>
        )}

        {(type === "about" || type === "hero") && (
          <label className={styles.field}>
            <span className={styles.label}>paragraphs</span>
            <textarea
              className={`${styles.textarea} ${styles.textareaTall}`}
              name="content"
              defaultValue={(section.content ?? []).join("\n")}
            />
            <span className={styles.hint}>
              One paragraph per line. Blank lines are ignored.
            </span>
          </label>
        )}

        {type === "skills" && (
          <Repeater
            name="skills"
            label="skill categories"
            itemNoun="category"
            addLabel="Add category"
            fields={[
              {
                name: "category",
                label: "category name",
                placeholder: "Languages",
                wide: true,
              },
              {
                name: "tags",
                label: "tags",
                type: "textarea",
                placeholder: "TypeScript | https://www.typescriptlang.org/",
                hint: "One per line, as `name | url`. The url is what the tag links to.",
              },
            ]}
            initial={(section.skills ?? []).map((c) => ({
              category: c.category,
              tags: tagsToText(c.tags),
            }))}
          />
        )}

        {type === "experience" && (
          <Repeater
            name="experience"
            label="roles"
            itemNoun="role"
            addLabel="Add role"
            fields={[
              { name: "title", label: "title", placeholder: "Web Developer" },
              { name: "company", label: "company", placeholder: "Ralph Lauren" },
              {
                name: "duration",
                label: "duration",
                placeholder: "2024 – Present",
              },
              {
                name: "description",
                label: "bullets",
                type: "textarea",
                hint: "One bullet per line.",
              },
            ]}
            initial={(section.experience ?? []).map((j) => ({
              title: j.title,
              company: j.company,
              duration: j.duration,
              description: j.description.join("\n"),
            }))}
          />
        )}

        {type === "education" && (
          <Repeater
            name="education"
            label="credentials"
            itemNoun="credential"
            addLabel="Add credential"
            fields={[
              {
                name: "degree",
                label: "degree",
                placeholder: "B.S. Software Engineering",
              },
              {
                name: "institution",
                label: "institution",
                placeholder: "Western Governors University",
              },
              { name: "duration", label: "duration", placeholder: "2026" },
              {
                name: "description",
                label: "details",
                type: "textarea",
                hint: "One line per detail.",
              },
            ]}
            initial={(section.education ?? []).map((e) => ({
              degree: e.degree,
              institution: e.institution,
              duration: e.duration,
              description: e.description.join("\n"),
            }))}
          />
        )}

        {type === "hero" && (
          <Repeater
            name="links"
            label="social links"
            itemNoun="link"
            addLabel="Add link"
            fields={[
              { name: "label", label: "label", placeholder: "GitHub" },
              {
                name: "url",
                label: "url",
                placeholder: "https://github.com/toddpolakdev",
              },
              {
                name: "icon",
                label: "icon",
                placeholder: "github",
                hint: "github, linkedin, twitter, mail, resume, codepen, website. Blank guesses from the label.",
              },
            ]}
            initial={(section.links ?? []).map((l) => ({
              label: l.label,
              url: l.url,
              icon: l.icon ?? "",
            }))}
          />
        )}

        <label className={styles.checkRow}>
          <input
            type="checkbox"
            name="published"
            defaultChecked={section.published !== false}
          />
          Published — visible on the live site
        </label>
      </div>

      <SaveBar state={state} />
    </form>
  );
}
