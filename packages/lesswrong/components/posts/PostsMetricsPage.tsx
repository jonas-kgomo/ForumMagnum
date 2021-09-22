// TODO; rename
import React from 'react'
import { Components, registerComponent } from '../../lib/vulcan-lib'
import { useLocation, useServerRequestStatus } from '../../lib/routeUtil'
import { useSingle } from '../../lib/crud/withSingle'
import { useCurrentUser } from '../common/withUser'
import { userOwns } from '../../lib/vulcan-users'
import { usePostMetrics } from './usePostMetrics'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core'
import { Link } from '../../lib/reactRouterWrapper'
import { forumTypeSetting } from '../../lib/instanceSettings'

const styles = (theme: ThemeType): JssStyles => ({
  viewingNotice: {
    marginTop: theme.spacing.unit * 4,
    '& a': {
      color: theme.palette.primary.main,
    },
  },
})

const PostsMetricsPage = ({ classes }) => {
  const { query } = useLocation()
  const { document: post } = useSingle({
    documentId: query.postId,
    collectionName: "Posts",
    fragmentName: 'PostsPage',
  })
  const currentUser = useCurrentUser()
  const serverRequestStatus = useServerRequestStatus()
  const { postMetrics, loading, error } = usePostMetrics(query.postId)
  const { WrappedLoginForm, SingleColumnSection, HeadTags, Loading } = Components
  if (!query.postId) {
    return <SingleColumnSection>
      Bad URL: Must specify a post ID
    </SingleColumnSection>
  }
  if (!currentUser) {
    if (serverRequestStatus) serverRequestStatus.status = 401
    return <SingleColumnSection>
      <p>You don't have permission to view this page. Would you like to log in?</p>
      <WrappedLoginForm />
    </SingleColumnSection>
  }
  // TODO; coauthors (maybe just asana task)
  if (
    !userOwns(currentUser, post) &&
    !currentUser?.isAdmin &&
    !currentUser?.groups?.includes('sunshineRegiment')
  ) {
    if (serverRequestStatus) serverRequestStatus.status = 403
    return <SingleColumnSection>
      You don't have permission to view this page.
    </SingleColumnSection>
  }
  if (loading) {
    return <Loading />
  }
  if (error) {
    throw error
  }

  const title = `Analytics for "${post.title}"`
  const isEAForum = forumTypeSetting.get() === 'EAForum'
  return (<>
    <HeadTags title={title} />
    <SingleColumnSection>
      <Typography variant='display3' gutterBottom>{title}</Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Unique client views</TableCell>
            <TableCell>{postMetrics?.uniqueClientViews}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Unique client views</TableCell>
            <TableCell>{postMetrics?.uniqueClientViews}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="body1" className={classes.viewingNotice}>
        <p>This features is new. <Link to='/contact-us'>Let us know what you think.</Link></p>
        <p><em>Post statistics are only viewable by {isEAForum && "authors and"} admins</em></p>
      </Typography>

    </SingleColumnSection>
  </>)
}

const PostsMetricsPageComponent = registerComponent('PostsMetricsPage', PostsMetricsPage, {styles})

declare global {
  interface ComponentTypes {
    PostsMetricsPage: typeof PostsMetricsPageComponent
  }
}
