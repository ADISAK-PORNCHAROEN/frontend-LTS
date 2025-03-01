'use client';
import { Box } from '@mui/material';
import React, { useMemo } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { PathUrls as Paths } from '#/constants/pathUrls';
import useGetAllCurriculum from '#/hooks/useGetAllCurriculum';
import { useUrlSafeBase64 } from '#/hooks/useUrlSafeBase64';
import { ICurriculum, ISubjects } from '#/types/LTS/ILts';
import useGetAllSubjects from '#/hooks/useGetAllSubjects';

export interface TracksType {
  level: number;
  name: string;
  linkTo: string;
}
export interface MatchUrlType {
  url: string;
  tracks: TracksType[];
}

export default function ApplicantTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dynamicParams = useParams()

  let pathnameWithoutDynamicParams = pathname
  const dynamicParamsKeys = Object.keys(dynamicParams)
  const nameParams = searchParams.get('name')
  let checkCreateSubject = false;
  let checkEditAccount = false;
  let checkTeachingPage = false;
  let checkCurriculumPage = false;
  let checkCloPage = false;
  let checkPloPage = false;
  // let checkAddTimesheet = false;
  if (dynamicParamsKeys.length > 0) {
    dynamicParamsKeys.forEach(param => {
      // let idx = pathnameWithoutDynamicParams.lastIndexOf("/")
      pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.replace(`/${dynamicParams[param]}`, '')
      // pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.slice(0, idx)
      if (param == 'subNameEn') {
        checkCreateSubject = true
      } else if (param == 'name') {
        checkEditAccount = true
      } else if (param == 'subNameEn') {
        checkTeachingPage = true
      } else if (param == 'degreeFullEn') {
        checkCurriculumPage = true
      } else if (param == 'ploName') {
        checkPloPage = true
      } else if (param == 'cloName') {
        checkCloPage = true
      }
    })
  }

  //PLOs
  const encodedCurId = searchParams.get("id");
  // CLOs
  const encodedSubId = searchParams.get("id");
  const curriculumId = searchParams.get("cur");
  const { encode, decode } = useUrlSafeBase64();
  const paramsId = Number(encodedCurId ? decode(encodedCurId) : null);
  const paramsSubId = Number(encodedSubId ? decode(encodedSubId) : null);
  const paramsCurId = Number(curriculumId ? decode(curriculumId) : null);
  console.log("encodedCurId", encodedCurId)
  console.log("encodedSubId", encodedSubId)
  console.log("curriculumId", curriculumId)
  console.log("paramsId", paramsId)
  console.log("paramsSubId", paramsSubId)
  console.log("paramsCurId", paramsCurId)

  const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
  const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();

  const curriculum = useMemo(() => {
    return curriculumData?.data?.find((item: ICurriculum) => item.id === paramsId)?.degreeShortEn;
  }, [curriculumData, paramsId]);

  const subject = useMemo(() => {
    return subjectsData?.data?.find((item: ISubjects) => item.id === paramsSubId && item.curriculum?.id === paramsCurId)?.subNameEn;
  }, [subjectsData?.data, paramsSubId, paramsCurId]);

  console.log("curriculum", curriculum)
  console.log("subject", subject)

  pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.replaceAll(`/lts`, '')

  let pathUrls: MatchUrlType[] = [
    // lts
    // {
    //   url: Paths.lts.root, tracks: [
    //     { level: 1, name: "Dashboard", linkTo: Paths.lts.root },
    //   ]
    // },
    {
      url: Paths.lts.accounts, tracks: [
        // { level: 1, name: "LTS", linkTo: Paths.lts.root },
        { level: 1, name: "Accounts", linkTo: Paths.lts.accounts },
      ]
    },
    {
      url: Paths.lts.subjects, tracks: [
        { level: 1, name: "Subjects", linkTo: Paths.lts.subjects },
      ]
    },
    {
      url: Paths.lts.teaching, tracks: [
        {
          level: 1, name: dynamicParams?.subNameEn ? decodeURIComponent(dynamicParams.subNameEn as string) : "Teaching",
          linkTo: Paths.lts.teaching
        },
      ]
    },
    {
      url: Paths.lts.curriculum, tracks: [
        { level: 1, name: "Curriculum", linkTo: Paths.lts.curriculum },
      ]
    },
    {
      url: Paths.lts.plos, tracks: [
        { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.plos}?id=${encodedCurId}` },
      ]
    },
    {
      url: Paths.lts.clos, tracks: [
        { level: 1, name: `${subject}`, linkTo: `${Paths.lts.clos}?id=${encodedSubId}&cur=${encodedCurId}` },
      ]
    },
    {
      url: Paths.lts.createSubjects, tracks: [
        { level: 1, name: "Subjects", linkTo: Paths.lts.subjects },
        { level: 2, name: "Create Subject", linkTo: Paths.lts.createSubjects },
      ]
    },
    {
      url: Paths.lts.createCurriculum, tracks: [
        { level: 1, name: "Curriculum", linkTo: Paths.lts.curriculum },
        { level: 2, name: "Create Curriculum", linkTo: Paths.lts.createCurriculum },
      ]
    },
    {
      url: Paths.lts.createPlo, tracks: [
        { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.plos}?id=${encodedCurId}` },
        { level: 2, name: "Create Plos", linkTo: Paths.lts.createPlo },
      ]
    },
    {
      url: Paths.lts.createClo, tracks: [
        { level: 1, name: `${subject}`, linkTo: `${Paths.lts.clos}?id=${encodedSubId}&cur=${encodedCurId}` },
        { level: 2, name: "Create Clos", linkTo: Paths.lts.createClo },
      ]
    },
    {
      url: Paths.lts.editSubjects, tracks: [
        { level: 1, name: "Subjects", linkTo: Paths.lts.subjects },
        { level: 2, name: "Edit Subject", linkTo: Paths.lts.editSubjects },
      ]
    },
    {
      url: Paths.lts.editAccount, tracks: [
        { level: 1, name: "Accounts", linkTo: Paths.lts.accounts },
        { level: 2, name: "Edit Accounts", linkTo: Paths.lts.editAccount },
      ]
    },
    {
      url: Paths.lts.editTeaching, tracks: [
        { level: 1, name: "Teaching", linkTo: Paths.lts.teaching },
        { level: 2, name: "Edit Teaching", linkTo: Paths.lts.editTeaching },
      ]
    },
    {
      url: Paths.lts.editCurriculum, tracks: [
        { level: 1, name: "Curriculum", linkTo: Paths.lts.curriculum },
        { level: 2, name: "Edit Curriculum", linkTo: Paths.lts.editCurriculum },
      ]
    },
  ];

  if (checkCreateSubject || checkEditAccount || checkTeachingPage || checkCurriculumPage || checkPloPage || checkCloPage) {

    if (pathnameWithoutDynamicParams == `${Paths.lts.subjects}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.subNameEn as string)}`, linkTo: Paths.lts.subjects },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.accounts}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.name as string)}`, linkTo: Paths.lts.accounts },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.curriculum}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.degreeFullEn as string)}`, linkTo: Paths.lts.curriculum },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.plos}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.ploName as string)}`, linkTo: `${Paths.lts.plos}?id=${encodedCurId}` },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.clos}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.cloName as string)}`, linkTo: Paths.lts.clos },
        )
      }
    }
  }

  const findMatchPath =
    pathUrls
      .find((item) => item.url === pathnameWithoutDynamicParams)
      ?.tracks.sort((a, b) => a.level - b.level) || [];

  return (
    <>
      {findMatchPath.length !== 0 && <Box className=" w-auto flex max-w-screen-2xl space-y-8 mb-4">
        <Box className=" px-3.5 lg:px-6 text-l">
          {"LTS"}
          {findMatchPath.map((track, index) => {
            if (index === (findMatchPath.length - 1)) {
              return (
                <span key={track.name + index} className=' text-[#3190FF]'>{' > '} {track.name}</span>
              );
            } else {
              return (
                <Link key={track.name + index} href={track.linkTo}>
                  <span className=' hover:text-ats-blue' >{' > '} {track.name}</span>
                </Link>
              );
            }
          })}
        </Box>
      </Box>}
    </>
  )
}