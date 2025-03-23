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
import useGetAllClo from '#/hooks/useGetAllClo';
import { IClo } from '#/types/LTS/IPlo';

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
  let checkCloSubPage = false;
  // let checkAddTimesheet = false;
  if (dynamicParamsKeys.length > 0) {
    dynamicParamsKeys.forEach(param => {
      // let idx = pathnameWithoutDynamicParams.lastIndexOf("/")
      pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.replace(`/${dynamicParams[param]}`, '')
      // pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.slice(0, idx)
      if (param === 'subNameEn') {
        if (pathname.includes('/clos/')) {
          checkCloSubPage = true;
        } else {
          checkCreateSubject = true;
        }
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
  const subId = searchParams.get("sub1");
  const sub2Id = searchParams.get("sub");
  const curriculumId = searchParams.get("cur");
  const cloId = searchParams.get("clo");
  const { encode, decode } = useUrlSafeBase64();
  const paramsId = Number(encodedCurId ? decode(encodedCurId) : null);
  const paramsSubId = Number(encodedSubId ? decode(encodedSubId) : null);
  const paramsSub1Id = Number(subId ? decode(subId) : null);
  const paramsSub2Id = Number(sub2Id ? decode(sub2Id) : null);
  const paramsCurId = Number(curriculumId ? decode(curriculumId) : null);
  // console.log("encodedCurId", encodedCurId)
  // console.log("encodedSubId", encodedSubId)
  // console.log("curriculumId", curriculumId)
  // console.log("paramsId", paramsId)
  // console.log("paramsSubId", paramsSubId)
  // console.log("paramsSub1Id", paramsSub1Id)
  // console.log("paramsCurId", paramsCurId)

  const { data: curriculumData, isLoading: isLoadingCurriculumData } = useGetAllCurriculum();
  const { data: subjectsData, isLoading: isLoadingSubjectsData } = useGetAllSubjects();
  const { data: cloData, isLoading: isLoadingPloData } = useGetAllClo();

  const curriculum = useMemo(() => {
    return curriculumData?.data?.find((item: ICurriculum) => item.id === paramsCurId)?.degreeShortTh;
  }, [curriculumData, paramsCurId]);

  const subject = useMemo(() => {
    const foundSubject = subjectsData?.data?.find((item: ISubjects) => item.id === paramsId && item.curriculum?.id === paramsCurId);
    // console.log("foundSubject", foundSubject)
    return foundSubject?.subNameTh;
  }, [subjectsData?.data, paramsId, paramsCurId]);

  const subjectTh = useMemo(() => {
    const foundSubject = subjectsData?.data?.find((item: ISubjects) => item.id === paramsSub2Id && item.curriculum?.id === paramsCurId);
    // console.log("foundSubject", foundSubject)
    return foundSubject?.subNameTh;
  }, [subjectsData?.data, paramsSub2Id, paramsCurId]);

  const subjectTh1 = useMemo(() => {
    const foundSubject = subjectsData?.data?.find((item: ISubjects) => item.id === paramsId);
    // console.log("foundSubject", foundSubject)
    return foundSubject?.subNameTh;
  }, [subjectsData?.data, paramsId]);

  const subject1 = useMemo(() => {
    const foundSubject = cloData?.data?.find((item: IClo) => item.id === paramsSubId && item.subjects?.id === paramsSub1Id && item.curriculum?.id === paramsCurId);
    // console.log("foundSubject", foundSubject)
    return foundSubject?.subjects?.subNameTh;
  }, [cloData?.data, paramsCurId, paramsSub1Id, paramsSubId]);

  // console.log("curriculum", curriculum)
  // console.log("subject", subject)
  // console.log("subject1", subject1)

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
        { level: 1, name: "บัญชีผู้ใช้", linkTo: Paths.lts.accounts },
      ]
    },
    {
      url: Paths.lts.subjects, tracks: [
        { level: 1, name: "รายวิชา", linkTo: Paths.lts.subjects },
      ]
    },
    {
      url: Paths.lts.teaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: Paths.lts.teaching },
      ]
    },
    {
      url: Paths.lts.coorTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: Paths.lts.coorTeaching },
      ]
    },
    {
      url: Paths.lts.instructorTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: Paths.lts.instructorTeaching },
      ]
    },
    {
      url: Paths.lts.curriculum, tracks: [
        { level: 1, name: "หลักสูตรรายวิชา", linkTo: Paths.lts.curriculum },
      ]
    },
    {
      url: Paths.lts.plos, tracks: [
        { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.plos}?cur=${curriculumId}` },
      ]
    },
    {
      url: Paths.lts.clos, tracks: [
        { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.clos}?cur=${curriculumId}` },
      ]
    },
    {
      url: Paths.lts.createClo, tracks: [
        { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.clos}?cur=${curriculumId}` },
        { level: 2, name: `${subjectTh}`, linkTo: `${Paths.lts.clos}/${decodeURIComponent(dynamicParams?.subNameEn as string)}/?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "สร้าง Clos", linkTo: Paths.lts.createClo },
      ]
    },
    {
      url: Paths.lts.createSubjects, tracks: [
        { level: 1, name: "รายวิชา", linkTo: Paths.lts.subjects },
        { level: 2, name: "สร้างรายวิชา", linkTo: Paths.lts.createSubjects },
      ]
    },
    {
      url: Paths.lts.createCurriculum, tracks: [
        { level: 1, name: "หลักสูตรรายวิชา", linkTo: Paths.lts.curriculum },
        { level: 2, name: "สร้างหลักสูตรรายวิชา", linkTo: Paths.lts.createCurriculum },
      ]
    },
    {
      url: Paths.lts.createPlo, tracks: [
        { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.plos}?cur=${curriculumId}` },
        { level: 2, name: "สร้าง Plos", linkTo: Paths.lts.createPlo },
      ]
    },
    {
      url: Paths.lts.createTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.teaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "สร้างรายงานการประเมิน", linkTo: Paths.lts.createTeaching },
      ]
    },
    {
      url: Paths.lts.coorCreateTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.coorTeaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "สร้างรายงานการประเมิน", linkTo: Paths.lts.coorCreateTeaching },
      ]
    },
    {
      url: Paths.lts.instructorCreateTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.instructorTeaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "สร้างรายงานการประเมิน", linkTo: Paths.lts.instructorCreateTeaching },
      ]
    },
    {
      url: Paths.lts.editSubjects, tracks: [
        { level: 1, name: "รายวิชา", linkTo: Paths.lts.subjects },
        { level: 2, name: "แก้ไขรายวิชา", linkTo: Paths.lts.editSubjects },
      ]
    },
    {
      url: Paths.lts.editAccount, tracks: [
        { level: 1, name: "บัญชีผู้ใช้งาน", linkTo: Paths.lts.accounts },
        { level: 2, name: "แก้ไขบัญชีผู้ใช้งาน", linkTo: Paths.lts.editAccount },
      ]
    },
    {
      url: Paths.lts.editTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.teaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "แก้ไขรายงานการประเมิน", linkTo: Paths.lts.editTeaching },
      ]
    },
    {
      url: Paths.lts.coorEditTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.coorTeaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "แก้ไขรายงานการประเมิน", linkTo: Paths.lts.coorEditTeaching },
      ]
    },
    {
      url: Paths.lts.instructorEditTeaching, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.instructorTeaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: "แก้ไขรายงานการประเมิน", linkTo: Paths.lts.instructorEditTeaching },
      ]
    },
    {
      url: Paths.lts.editCurriculum, tracks: [
        { level: 1, name: "หลักสูตรรายวิชา", linkTo: Paths.lts.curriculum },
        { level: 2, name: "แก้ไขหลักสูตรรายวิชา", linkTo: Paths.lts.editCurriculum },
      ]
    },
    {
      url: Paths.lts.evaluation, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.teaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: `ประเมินรายวิชา ${subjectTh}`, linkTo: Paths.lts.evaluation },
      ]
    },
    {
      url: Paths.lts.coorEvaluation, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.coorTeaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: `ประเมินรายวิชา ${subjectTh}`, linkTo: Paths.lts.coorEvaluation },
      ]
    },
    {
      url: Paths.lts.instructorEvaluation, tracks: [
        { level: 1, name: `${subjectTh}`, linkTo: `${Paths.lts.instructorTeaching}?sub=${sub2Id}&cur=${curriculumId}` },
        { level: 2, name: `ประเมินรายวิชา ${subjectTh}`, linkTo: Paths.lts.instructorEvaluation },
      ]
    },
  ];

  if (checkCreateSubject || checkEditAccount || checkTeachingPage || checkCurriculumPage || checkPloPage || checkCloPage || checkCloSubPage) {

    if (pathnameWithoutDynamicParams == `${Paths.lts.subjects}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${subjectTh1}`, linkTo: Paths.lts.subjects },
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
          { level: 3, name: `${curriculum}`, linkTo: Paths.lts.curriculum },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.plos}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.ploName as string)}`, linkTo: `${Paths.lts.plos}?id=${subId}?cur=${curriculumId}` },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.clos}`) {
      if (cloId) {
        const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams);
        if (idx != -1) {
          pathUrls[idx].tracks = [
            { level: 1, name: `${curriculum}`, linkTo: `${Paths.lts.clos}?cur=${curriculumId}` },
            { level: 2, name: `${subjectTh}`, linkTo: `${Paths.lts.clos}/${encodeURIComponent(dynamicParams?.subNameEn as string)}/?sub=${sub2Id}&cur=${curriculumId}` },
            { level: 3, name: `${decodeURIComponent(dynamicParams?.cloName as string || "CLO" + cloId)}`, linkTo: `${Paths.lts.clos}?sub=${sub2Id}&cur=${curriculumId}&clo=${cloId}` }
          ];
        }
      } else {
        const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams);
        if (idx != -1) {
          pathUrls[idx].tracks.push(
            { level: 3, name: `${subjectTh}`, linkTo: `${Paths.lts.clos}?sub=${sub2Id}&cur=${curriculumId}` },
          );
        }
      }
    } else if (pathnameWithoutDynamicParams.includes(`${Paths.lts.clos}`) && pathnameWithoutDynamicParams != `${Paths.lts.createClo}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams);
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.cloName as string)}`, linkTo: `${Paths.lts.clos}?sub=${sub2Id}&cur=${curriculumId}&clo=${cloId}` },
        );
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