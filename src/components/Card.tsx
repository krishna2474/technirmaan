import { Link } from "react-router-dom";

type CardProps = {
  title: string;
  description: string;
  image: string;
  key: string;
};
export const Card = ({ title, description, image, key }: CardProps) => {
  return (
    <div className="flex">
      <section className="bg-gray-2 pb-10 lg:pb-5 px-5">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mb-10 overflow-hidden rounded-lg bg-white/10 backdrop-blur-3xl border border-white/50  duration-300 xl: h-[420px]">
                <div className="flex justify-center mt-4">
                  <img src={`${image}`} width={150} alt="image" />
                </div>
                <div className="px-4 text-center sm:p-7 md:p-5 xl:p-7 mt-[-10px]">
                  <h3 className="mb-4 block text-xl font-semibold text-dark text-white sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
                    {title}
                  </h3>
                  <p className="mb-7 text-base leading-relaxed text-white xl:h-20">
                    {description}
                  </p>

                  <Link
                    to={`/register/${key}`}
                    className="inline-block text-white rounded-full border border-gray-3 px-7 py-2 text-base font-medium text-body-color transition mt-6 hover:bg-purple-500 hover:text-black"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
