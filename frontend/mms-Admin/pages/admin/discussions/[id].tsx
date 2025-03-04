import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import React, { ReactElement, use, useEffect, useState } from "react";
import {
  commentIcon,
  bookmark,
  shareIcon,
  moreIcon,
  clockIcon
} from "@/public";
import Image from "next/image";
import { Link } from "react-feather";
import { useFetchDiscussion } from "../../../hooks/useDiscussion";

import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import {
  GetServerSideProps,
  NextPageContext,
  GetServerSidePropsContext
} from "next";
import { useComment } from "@/hooks/useComment";

interface discussion {
  id: number;
  title: string;
  content: string;
  owner_id: string;
  updated_at: string;
  created_at: string;
  creator_details: {};
  comments: [];
}

interface comment {
  full_name: string;
  content: string;
  owner_id: string;
  created_at: string;
}

function Comment(props: any) {
  const router = useRouter();
  const { id } = router.query;

  const [userData, setUserData] = React.useState<any>(null);
  const { mutate, isLoading: loadingComment } = useComment();

  const [values, setValues] = useState("");

  const [loading, setLoading] = React.useState<boolean>(false);
  useEffect(() => {
    // Check if localStorage is available

    setLoading(true);
    if (typeof localStorage !== "undefined") {
      // Get favorites from localStorage
      const userData = localStorage.getItem("user");

      if (userData) {
        setUserData(JSON.parse(userData));
        setLoading(false);
      }
    }
  }, []);

  // const [id, setId] = useState("");

  // useEffect(() => {
  //   if (router.isReady) {
  //     setId(router.query.id as any);
  //   }
  // }, []);

  const { data, isLoading, isError, error } = useFetchDiscussion(props.id);

  console.log(props, "id");

  const handlePostComment = async (e: any) => {
    e.preventDefault();

    mutate({
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      content: values,
      id: data?.data.data.id,
      setValues: setValues
    });
  };

  console.log(values, "props");

  if (isLoading) {
    return (
      <div className="flex justify-center my-20">
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  return (
    <div>
      {
        <>
          <div className="discussion">
            <div className="discussion__card border my-2 border-[#E6E6E6] rounded-[10px] px-[20px] py-[24px]">
              <div className="card__header mb-[15px] flex justify-between">
                <div className="post__author">
                  <h1 className="text-mmsBlack2 font-semibold text-xl">
                    {data?.data.data.creator_details.full_name}
                  </h1>

                  <h5 className="text-mmsBlack5 font-normal text-sm">
                    {data?.data.data.creator_details.role}
                  </h5>
                </div>

                <div className="more">
                  <Image src={moreIcon} alt="more" />
                </div>
              </div>

              <h3 className="text-xl font-normal text-mmsBlack2 ">
                {data?.data.data?.title}
              </h3>

              <p className="text-mmsBlack5 text-base font-normal">
                {data?.data.data.content}
              </p>

              <div className="discussion__card___actions pt-[24px] flex items-center justify-between">
                <div className="first">
                  <div className="flex items-center space-x-[29px]">
                    {/* <div className="comment cursor-pointer">
                      <Link href={`/admin/discussions/comment`}>
                        <Image src={commentIcon} alt="comment" />
                      </Link>
                    </div> */}
                    <div className="bookmark cursor-pointer">
                      <Image src={bookmark} alt="bookmark" />
                    </div>
                    <div className="share cursor-pointer">
                      <Image src={shareIcon} alt="share" />
                    </div>
                  </div>
                </div>

                <div className="second flex items-center text-xs text-mmsBlack5 font-normal space-x-1">
                  <Image src={clockIcon} alt="clock" />

                  <p>
                    {new Date(data?.data?.data.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="add__comment bg-green11 border border-mmsPry10 rounded-[5px] py-3 px-[22px] mt-[41px] mb-[23px]">
            <textarea
              onChange={e => setValues(e.target.value)}
              value={values}
              className="w-full h-[100px]  bg-green11 rounded-[5px]  outline-none py-[24px] text-mmsBlack5 text-base font-normal"
              placeholder="Write a comment"
            ></textarea>

            <div className="actions flex justify-between items-center">
              <div className="file flex space-x-4">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.875 9.48569L11.3797 18.0925C9.03386 20.4692 5.23035 20.4692 2.88443 18.0925C0.538523 15.7158 0.538523 11.8624 2.88443 9.48569L9.96386 2.31335C11.5278 0.728883 14.0634 0.728883 15.6274 2.31335C17.1913 3.89782 17.1913 6.46675 15.6274 8.05122L8.54792 15.2235C7.76599 16.0158 6.49817 16.0158 5.71619 15.2235C4.93422 14.4313 4.93422 13.1468 5.71619 12.3546L12.7956 5.18229"
                    stroke="#808080"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6424 9.43311L14.6257 9.41634M8.39243 9.43311L8.37565 9.41634M7.33398 14.6247C7.33398 14.6247 7.46434 14.8854 7.77117 15.2224C8.33169 15.8379 9.48117 16.708 11.5007 16.708C13.5201 16.708 14.6696 15.8379 15.2301 15.2224C15.537 14.8854 15.6673 14.6247 15.6673 14.6247M11.5007 21.9163C5.74768 21.9163 1.08398 17.2526 1.08398 11.4997C1.08398 5.74671 5.74768 1.08301 11.5007 1.08301C17.2536 1.08301 21.9173 5.74671 21.9173 11.4997C21.9173 17.2526 17.2536 21.9163 11.5007 21.9163Z"
                    stroke="#808080"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="post__comment">
                <button
                  className="bg-mmsPry3 text-white rounded-[5px] px-[15px] py-[2px]  h-[24px] text-sm font-normal"
                  onClick={handlePostComment}
                >
                  {loadingComment ? (
                    <div className="flex justify-center">
                      <ClipLoader size={20} color="#36d7b7" />
                    </div>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="comments h-full w-full border rounded-[10px]  border-[#E6E6E6] p-[23px] ">
            {data?.data &&
              data?.data.data?.comments?.map((item: any) => (
                <div
                  className="comment__item flex justify-between bg-green11 border border-mmsPry10 rounded-[5px] my-[15px] p-[20px]"
                  key={item.owner_id}
                >
                  <div className="comment__details">
                    <h2 className="name text-mmsBlack2 font-semibold text-base">
                      {item.full_name}
                    </h2>

                    <div className="comment text-mmsBlack5 text-xs font-normal">
                      {item.content}
                    </div>
                  </div>

                  <div className="date text-mmsBlack5 text-sm font-normal">
                    <Image src={moreIcon} alt="see more" />
                  </div>
                </div>
              ))}
          </div>
        </>
      }
    </div>
  );
}

export default Comment;

Comment.requireAuth = true;

Comment.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout title="Comments">{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query;
  return { props: { id } };
};
