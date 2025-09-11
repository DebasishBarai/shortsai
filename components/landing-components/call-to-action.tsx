import { Headset } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const CallToAction = () => {
  const features = [
    {
      title: "🎥 Create AI-Powered Short Films",
      description:
        "Turn your ideas into stunning 2-minute HD short films using AI. Simply input your story and let our AI handle the magic—from script to final cut.",
      image: "/features/1.png",
      reverse: false,
    },
    {
      title: "🧑‍🤝‍🧑 Consistent Characters",
      description:
        "Generate and maintain consistent, lifelike characters throughout your entire film, ensuring a seamless cinematic experience.",
      image: "/features/2.png",
      reverse: true,
    },
    {
      title: "🎨 Multiple Video Styles",
      description:
        "Choose from various cinematic styles like Ghibli, 3D Pixar, Realistic, Anime, and more to bring your unique vision to life.",
      image: "/features/3.jpg",
      reverse: false,
    },
    {
      title: "📽️ HD Quality, 2-Minute Short Films",
      description:
        "Generate high-definition short films in under 2 minutes, ready to share on social media or pitch to studios.",
      image: "/features/4.png",
      reverse: true,
    },
  ];

  return (
    <div className="w-full">
      {features.map((f, idx) => (
        <section key={idx} className="py-16 sm:py-24">
          <div
            className={`container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse ${f.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-12`}
          >
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                {f.title}
              </h2>
              <p className="text-lg mb-6">{f.description}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 font-semibold bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
              >
                <Headset className="mr-3 h-5 w-5" />
                Start for free
              </Link>
            </div>
            <div className="lg:w-1/2">
              <Image
                src={f.image}
                alt={f.title}
                width={500}
                height={500}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
