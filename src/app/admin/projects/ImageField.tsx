"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import styles from "../admin.module.css";
import { getUploadSignature } from "@/app/actions/admin";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

/**
 * Uploads straight from the browser to Cloudinary using a signature minted
 * server-side, so image bytes never round-trip through this app. The resulting
 * secure_url is what gets submitted with the form.
 */
export default function ImageField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Use a PNG, JPEG, WebP, AVIF, or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is larger than 10 MB.");
      return;
    }

    const signature = await getUploadSignature();
    if ("error" in signature) {
      setError(signature.error);
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signature.apiKey);
    body.append("timestamp", String(signature.timestamp));
    body.append("signature", signature.signature);
    body.append("folder", signature.folder);

    // XHR rather than fetch, because fetch cannot report upload progress.
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      setProgress(null);
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.secure_url) {
          setUrl(res.secure_url);
        } else {
          setError(res.error?.message ?? `Upload failed (${xhr.status}).`);
        }
      } catch {
        setError("Cloudinary returned an unreadable response.");
      }
    };

    xhr.onerror = () => {
      setProgress(null);
      setError("Upload failed — check your connection.");
    };

    setProgress(0);
    xhr.send(body);
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div className={styles.imageRow}>
        <div className={styles.thumb}>
          {url ? (
            <Image
              src={url}
              alt=""
              fill
              sizes="168px"
              // Local /images/* paths and Cloudinary URLs both work; anything
              // else is shown unoptimized rather than failing the build.
              unoptimized={!url.startsWith("/") && !url.includes("res.cloudinary.com")}
            />
          ) : (
            <div className={styles.thumbEmpty}>no image</div>
          )}
        </div>

        <div className={styles.imageControls}>
          <input type="hidden" name={name} value={url} />

          <input
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/… or /images/shot.png"
            aria-label={`${label} URL`}
          />

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />

          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className={`${styles.btnGhost} ${styles.btnSm}`}
              onClick={() => inputRef.current?.click()}
              disabled={progress !== null}
            >
              <FiUpload size={12} />
              {progress !== null ? `uploading ${progress}%` : "Upload"}
            </button>

            {url && (
              <button
                type="button"
                className={`${styles.btnGhost} ${styles.btnSm}`}
                onClick={() => setUrl("")}
              >
                <FiX size={12} /> Clear
              </button>
            )}
          </div>

          {progress !== null && (
            <div className={styles.progress}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && (
            <span className={`${styles.status} ${styles.statusErr}`}>
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
