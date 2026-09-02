"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  Leaf,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const HUBSPOT_ENDPOINT =
  "https://api-eu1.hsforms.com/submissions/v3/integration/submit/149113634/33c0e56b-9a54-4315-a0e0-6a9c80255b95";

export default function ApplyPage() {
  const [form, setForm] = useState({
    email: "",
    firstname: "",
    lastname: "",
    date_of_birth: "",
    phone: "",
    gender: "",
    city: "",
    school_name: "",
    country: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(HUBSPOT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            {
              objectTypeId: "0-1",
              name: "email",
              value: form.email,
            },
            {
              objectTypeId: "0-1",
              name: "firstname",
              value: form.firstname,
            },
            {
              objectTypeId: "0-1",
              name: "lastname",
              value: form.lastname,
            },
            {
              objectTypeId: "0-1",
              name: "date_of_birth",
              value: form.date_of_birth,
            },
            {
              objectTypeId: "0-1",
              name: "phone",
              value: form.phone,
            },
            {
              objectTypeId: "0-1",
              name: "gender",
              value: form.gender,
            },
            {
              objectTypeId: "0-1",
              name: "city",
              value: form.city,
            },
            {
              objectTypeId: "0-1",
              name: "school_name",
              value: form.school_name,
            },
            {
              objectTypeId: "0-1",
              name: "country",
              value: form.country,
            },
            {
              objectTypeId: "0-1",
              name: "message",
              value: form.message,
            },
          ],
          context: {
            pageUri:
              typeof window !== "undefined"
                ? window.location.href
                : "https://greenforceafrica.com/apply",
            pageName: "Apply for Support",
          },
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        console.error("HubSpot submission error:", result);

        throw new Error("Submission failed");
      }

      setSubmitted(true);

      setForm({
        email: "",
        firstname: "",
        lastname: "",
        date_of_birth: "",
        phone: "",
        gender: "",
        city: "",
        school_name: "",
        country: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't submit your application right now. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#173f35]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[70px] border-white" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full border-[50px] border-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <HeartHandshake className="h-4 w-4" />
              GreenForce Support
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Need support?
              <br />
              <span className="text-[#d9e8c8]">Start here.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
              If you or someone in your community needs support, tell us a
              little about your situation. Our team will review your
              application and get back to you if we need more information or
              are able to provide support.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT AREAS */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-3">
          <div className="flex gap-4 border-b border-gray-200 px-6 py-7 md:border-b-0 md:border-r md:px-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4e8] text-[#315b43]">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">Education</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                School support, scholarships, materials and related needs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-gray-200 px-6 py-7 md:border-b-0 md:border-r md:px-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eee4] text-[#765d35]">
              <Leaf className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">Skills & Opportunity</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Agriculture, vocational training and youth opportunities.
              </p>
            </div>
          </div>

          <div className="flex gap-4 px-6 py-7 md:px-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eaea] text-[#744747]">
              <HeartHandshake className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">Community Care</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Support for vulnerable people and community wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM AREA */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* LEFT SIDE */}
          <div className="lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#477057]">
              Request support
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Tell us what you need.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600">
              Complete the form with enough information for our team to
              understand your situation. You do not need to know exactly what
              programme you belong to — simply explain what support you need
              and why.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9f0e6] text-[#315b43]">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Your information is reviewed carefully
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Your application goes to GreenForce for review. We may
                    contact you if additional information is needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9f0e6] text-[#315b43]">
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    What happens next?
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Once submitted, our team will review your request and get
                    back to you if we are able to assist or need more details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.06)] md:p-10">
            {submitted ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f3e5] text-[#315b43]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <h2 className="mt-7 text-3xl font-bold text-gray-900">
                  Application Received
                </h2>

                <p className="mt-4 max-w-md text-base leading-7 text-gray-600">
                  Thank you for submitting your application to GreenForce
                  Foundation Africa.
                </p>

                <p className="mt-3 max-w-md text-base leading-7 text-gray-600">
                  We have received your information and will review your
                  request. If we need any additional information or are able to
                  provide support, a member of our team will contact you.
                </p>

                <p className="mt-6 text-sm font-medium text-gray-500">
                  Thank you for reaching out to GreenForce Foundation Africa.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Beneficiary Application
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Please provide your details below. Fields marked with *
                    are required.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* NAME */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstname"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        First Name *
                      </label>

                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                        value={form.firstname}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                        placeholder="Your first name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastname"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Last Name *
                      </label>

                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        required
                        value={form.lastname}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  {/* EMAIL + PHONE */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Email *
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Phone Number *
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                        placeholder="+233..."
                      />
                    </div>
                  </div>

                  {/* DOB + GENDER */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="date_of_birth"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Date of Birth *
                      </label>

                      <input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        required
                        value={form.date_of_birth}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Gender *
                      </label>

                      <select
                        id="gender"
                        name="gender"
                        required
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                      >
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* CITY + COUNTRY */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        City *
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={form.city}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                        placeholder="e.g. Apam"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                      >
                        Country *
                      </label>

                      <select
                        id="country"
                        name="country"
                        required
                        value={form.country}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                      >
                        <option value="">Select country</option>
                        <option value="Ghana">Ghana</option>
                        <option value="The Gambia">The Gambia</option>
                      </select>
                    </div>
                  </div>

                  {/* SCHOOL */}
                  <div>
                    <label
                      htmlFor="school_name"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      School Name
                      <span className="ml-2 font-normal text-gray-400">
                        If applicable
                      </span>
                    </label>

                    <input
                      id="school_name"
                      name="school_name"
                      type="text"
                      value={form.school_name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                      placeholder="Enter your school name"
                    />
                  </div>

                  {/* SUPPORT MESSAGE */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      What support do you need and why? *
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={7}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-[#477057] focus:ring-2 focus:ring-[#477057]/10"
                      placeholder="Please explain your situation, the support you need, and any details you think our team should know."
                    />
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                      {error}
                    </div>
                  )}

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173f35] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#245648] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending application...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-gray-400">
                    By submitting this form, you are providing your information
                    to GreenForce Foundation Africa for the purpose of
                    reviewing your request for support.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
