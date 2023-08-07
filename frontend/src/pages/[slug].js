import { getAllAccounts, getSelectedAccount } from "@/api/services";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function SlugPage({ data }) {
  return (
    <main
      className={`flex min-h-screen max-w-2xl m-auto flex-col items-center p-4 pt-24 ${inter.className}`}
    >
      <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden mb-4">
        <Image 
          className="relative"
          layout="fill"
          objectFit="cover"
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}${data.attributes.photo.data.attributes.url}`}
          alt={data.attributes.fullname}
        />
      </div>
      <div className="flex flex-col items-center gap-2 w-full mb-12">
        <h3 className="text-2xl font-bold">{data.attributes.fullname}</h3>
        <p className="text-lg">{data.attributes.bio}</p>
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        {data.attributes.links.data.map((value, index) => {
          return (
            <a
              key={index}
              className="h-full w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 rounded-[24px] p-4 hover:scale-105 transition-all cursor-pointer"
              href={value.attributes.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value.attributes.title}
            </a>
          );
        })}
      </div>
    </main>
  );
}

// getStaticPaths adalah function yang nanti akan diexecute oleh next.js ketika project di build
// yang fungsinya untuk menghasilkan file .html apa saja berdasarkan dynamic routes nya
export async function getStaticPaths() {
  // fetching datanya untuk keperluan ada dynamic routes apa aja
  const accounts = await getAllAccounts();
  const dataAccounts = await accounts.data.data;

  // deklarasi variable untuk menentukan ada slug apa
  // aja yang nantinya menghasilkan file .html
  const paths = dataAccounts.map((value) => {
    return {
      params: { slug: value.attributes.slug },
    };
  });

  // return ini yang nantinya akan memberitahu next.js akan ada path apa saja
  // berdasarkan slug dari BE.
  // blocking tujuannya untuk nanti ketika user mengetik suatu path yang
  // tidak ada di list slug, akan di return error/tidak ada
  return { paths, fallback: "blocking" };
}

// getStaticProps adalah function untuk get data yang nantinya akan dikirim ke component
// returnnya harus ada props dengan tipe data object, dan ada revalidate untuk menjalankan ISR nya
// revalidate menunjukan seberapa lama (dalam detik) nextjs melakukan validasi
export async function getStaticProps({ params }) {
  const selectedAccount = await getSelectedAccount(params.slug);

  return {
    props: {
      data: selectedAccount.data.data[0],
    },
    revalidate: 10,
  };
}
