'use client';
import { Box } from '@mui/material';
import React, { useMemo } from 'react'
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { PathUrls as Paths } from '#/constants/pathUrls';

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
  // let checkAddTimesheet = false;
  if (dynamicParamsKeys.length > 0) {
    dynamicParamsKeys.forEach(param => {
      // let idx = pathnameWithoutDynamicParams.lastIndexOf("/")
      pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.replace(`/${dynamicParams[param]}`, '')
      // pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.slice(0, idx)
      if (param == 'subNameTh') {
        checkCreateSubject = true
      } else if (param == 'name') {
        checkEditAccount = true
      }
    })
  }

  console.log("pathnameWithoutDynamicParams", pathnameWithoutDynamicParams);
  console.log("pathname", pathname);
  console.log("dynamicParams", dynamicParams);

  pathnameWithoutDynamicParams = pathnameWithoutDynamicParams.replaceAll(`/lts`, '')

  let pathUrls: MatchUrlType[] = [
    // lts
    {
      url: Paths.lts.root, tracks: [
        { level: 1, name: "Dashboard", linkTo: Paths.lts.root },
      ]
    },
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
      url: Paths.lts.createSubjects, tracks: [
        { level: 1, name: "Subjects", linkTo: Paths.lts.subjects },
        { level: 2, name: "Create Subject", linkTo: Paths.lts.createSubjects },
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
  ];

  if (checkCreateSubject || checkEditAccount) {

    if (pathnameWithoutDynamicParams == `${Paths.lts.subjects}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.subNameTh as string)}`, linkTo: Paths.lts.subjects },
        )
      }
    } else if (pathnameWithoutDynamicParams == `${Paths.lts.accounts}`) {
      const idx = pathUrls.findIndex(path => path.url == pathnameWithoutDynamicParams)
      if (idx != -1) {
        pathUrls[idx].tracks.push(
          { level: 3, name: `${decodeURIComponent(dynamicParams?.name as string)}`, linkTo: Paths.lts.accounts },
        )
      }
    }
  }

  const findMatchPath =
    pathUrls
      .find((item) => item.url === pathnameWithoutDynamicParams)
      ?.tracks.sort((a, b) => a.level - b.level) || [];

  /* const findMatchPath = React.useMemo(() => {
    return pathUrls.find(item => item.url === pathnameWithoutDynamicParams)?.tracks.sort((a, b) => a.level - b.level) || [];
  }, [pathUrls, pathnameWithoutDynamicParams]); */

  /* const clientCode = dynamicParams.clientCode ? decodeURIComponent(dynamicParams.clientCode as string) : undefined;
  const projectName = dynamicParams.projectName ? decodeURIComponent(dynamicParams.projectName as string) : undefined;
  const phaseId = dynamicParams.phaseId ? decodeURIComponent(dynamicParams.phaseId as string) : undefined;
  const phaseName = dynamicParams.phaseName ? decodeURIComponent(dynamicParams.phaseName as string) : undefined;

  const lastSeparatorIndex = projectName?.lastIndexOf('?');
  const decodedProjectName = projectName?.substring(0, lastSeparatorIndex);
  
  // Post-process the findMatchPath to handle dynamic workspace, project routes, and special cases
  const processedMatchPath = React.useMemo(() => {
    if (pathnameWithoutDynamicParams.includes('/estimate')) {
      return [
        { level: 1, name: "Client", linkTo: Paths.projects.root },
        ...(phaseName ? [{ level: 2, name: phaseName, linkTo: `${Paths.projects.root}/${encodeURIComponent(clientCode ?? '')}/${encodeURIComponent(projectName ?? '')}/${encodeURIComponent(phaseId ?? '')}/${encodeURIComponent(phaseName ?? '')}` }] : []),
        { level: 3, name: "Estimate Cost", linkTo: pathname }
      ]
    } else if (pathnameWithoutDynamicParams.startsWith('/client')) {
      let newTracks = [
        { level: 1, name: "Client", linkTo: Paths.projects.root },
      ];
  
      if (phaseName) {
        newTracks.push({ level: 2, name: decodedProjectName ?? '', linkTo: `${Paths.projects.root}/${encodeURIComponent(clientCode ?? '')}/${encodeURIComponent(projectName ?? '')}` });
        newTracks.push({ level: 3, name: phaseName, linkTo: pathname });
      } else {
        if (clientCode) {
          newTracks.push({ level: 2, name: clientCode, linkTo: `${Paths.projects.root}/${encodeURIComponent(clientCode)}` });
        }
        if (projectName) {
          newTracks.push({ level: 3, name: decodedProjectName ?? '', linkTo: pathname });
        }
      }

      return newTracks;
    }
    return findMatchPath;
  }, [findMatchPath, pathnameWithoutDynamicParams, clientCode, projectName, phaseId, phaseName, pathname, decodedProjectName]); */

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