import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SUBMIT_CONTACT } from "@/mutations/submitContact";
import styles from "./Contact.module.css";
import clsx from "clsx";

const Contact: React.FC = () => {
  type ContactFormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
    website?: string;
  };

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const [submitContact, { loading, error }] = useMutation(SUBMIT_CONTACT);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (formData.website) {
      return;
    }

    e.preventDefault();

    try {
      await submitContact({ variables: formData });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // <section id="contact" className={styles.contact}>
    <section id="contact" className="section">
      <div className="container">
        <h2 className="sectionTitle fade-in">Contact Me</h2>

        <div className={clsx(styles.contactGrid, "fade-in")}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div>
                <strong>Email</strong>
                <br />
                <a
                  className={styles.contactLink}
                  href="mailto:toddpolakdev@gmail.com">
                  toddpolakdev@gmail.com
                </a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div>
                <strong>Phone</strong>
                <br />
                <a className={styles.contactLink} href="tel:909.582.0448">
                  909.582.0448
                </a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div>
                <strong>LinkedIn</strong>
                <br />
                <a
                  className={styles.contactLink}
                  href="https://linkedin.com/in/todd-polak-dev"
                  target="_blank">
                  linkedin.com/in/todd-polak-dev
                </a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div>
                <strong>GitHub</strong>
                <br />
                <a
                  className={styles.contactLink}
                  href="https://github.com/toddpolakdev"
                  target="_blank">
                  github.com/toddpolakdev
                </a>
              </div>
            </div>
          </div>

          {submitted ? (
            <p className={styles.successMessage}>
              ✅ Thank you for reaching out! I’ll get back to you soon.
            </p>
          ) : (
            <div className={styles.contactForm}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={50}
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    maxLength={100}
                    autoComplete="off"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    maxLength={1000}
                    rows={6}
                    autoComplete="off"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btnPrimary"
                  style={{ width: "100%" }}
                  disabled={loading || submitted}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
                {error && (
                  <p style={{ color: "red" }}>Error sending message.</p>
                )}
                <input
                  type="text"
                  name="website"
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
