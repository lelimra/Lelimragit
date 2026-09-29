"use client";

import { Quote, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

interface Profile {
  name: string;
  role: string;
  description: string;
  theme: "orange" | "navy";
}

export default function LeadershipProfiles() {
  const t = useTranslations();

  const profiles: Profile[] = [
    {
      name: "Shaik Aslam",
      role: t("aboutFounderRole"),
      description: t("aboutFounderDescription"),
      theme: "orange",
    },
    {
      name: "Shaik Salman",
      role: t("aboutFutureLeadershipRole"),
      description: t("aboutFutureLeadershipDescription"),
      theme: "navy",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#174e8c]">
            {t("aboutLeadershipEyebrow")}
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t("aboutLeadershipTitle")}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            {t("aboutLeadershipDescription")}
          </p>
        </div>

        {/* =====================================================
            PROFILE GRID
        ===================================================== */}

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">

          {profiles.map((profile) => {
            const isOrange = profile.theme === "orange";

            return (
              <article
                key={profile.name}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  ${
                    isOrange
                      ? "border-orange-200"
                      : "border-slate-200"
                  }
                `}
              >

                {/* =================================================
                    TOP BANNER
                ================================================= */}

                <div
                  className={`
                    h-32
                    sm:h-36
                    ${
                      isOrange
                        ? "bg-gradient-to-r from-cyan-500 via-orange-600 to-blue-700"
                        : "bg-gradient-to-r from-slate-800 via-slate-900 to-[#07192f]"
                    }
                  `}
                />

                {/* =================================================
                    IMAGE PLACEHOLDER
                ================================================= */}

                <div className="relative -mt-16 flex justify-center sm:-mt-[74px]">
                  <div
                    className={`
                      flex
                      h-32
                      w-32
                      items-center
                      justify-center
                      rounded-full
                      border-[6px]
                      border-white
                      shadow-lg
                      sm:h-36
                      sm:w-36
                      ${
                        isOrange
                          ? "bg-orange-50 text-orange-500"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                  >
                    <UserRound
                      className="h-14 w-14 sm:h-16 sm:w-16"
                      strokeWidth={1.2}
                    />
                  </div>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="px-6 pb-8 pt-6 text-center sm:px-8 sm:pb-10">

                  {/* Name */}
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-[27px]">
                    {profile.name}
                  </h3>

                  {/* Role */}
                  <div
                    className={`
                      mx-auto mt-3 inline-flex
                      max-w-full
                      items-center
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-bold
                      sm:text-sm
                      ${
                        isOrange
                          ? "bg-orange-50 text-orange-700"
                          : "bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    {profile.role}
                  </div>

                  {/* Divider */}
                  <div className="mx-auto my-6 h-px w-16 bg-slate-200" />

                  {/* Quote */}
                  <div className="relative px-2 sm:px-4">

                    <Quote
                      className={`
                        absolute
                        -left-1
                        -top-1
                        h-7
                        w-7
                        opacity-20
                        sm:-left-2
                        ${
                          isOrange
                            ? "text-orange-500"
                            : "text-slate-500"
                        }
                      `}
                      fill="currentColor"
                    />

                    <p className="text-sm italic leading-7 text-slate-600 sm:text-base">
                      {profile.description}
                    </p>

                  </div>

                </div>
              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
}