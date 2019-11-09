import React from 'react';
import { Card, CardContent, Box, makeStyles} from '@material-ui/core';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2)
  },
  content:{
    position: "relative",
    padding: theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2)
    }
  },
  mb1:{
    marginBottom: theme.spacing(1)
  },
  profileActions: {
    position: "absolute",
    top: 8,
    right: 14,
    minWidth: 72,
    minHeight: 34,
    [theme.breakpoints.down('xs')]: {
      display: "flex",
      minWidth: 23,
      maxWidth: 23,
      minHeight: 68,
      flexWrap: "wrap-reverse",
    }
  }
}))

const PhotosSkelton = () => (
  <Box width={{xs: 120, md: 160}} height={{xs: 150, md: 200}}>
    <Skeleton variant="rect" width="100%" height="100%" />
  </Box>
)

const ProfileNameSkelton = () => (
  <Box px={2} py={0} >
    <Skeleton height={10} width={120} />
    <Skeleton height={6} width={60} />
  </Box>
)

const ProfileInfoSkelton = () => (
  <Box px={2} display="flex" flexWrap="wrap" width="100%">
      <Box width="50%">
        <Skeleton height={8} width="80%" />
        <Skeleton height={8} width="80%" />
        <Skeleton height={8} width="80%" />
        <Skeleton height={8} width="80%" />
      </Box>
      <Box width="50%">
        <Skeleton height={8} width="80%" />
        <Skeleton height={8} width="80%" />
        <Skeleton height={8} width="80%" />
        <Skeleton height={8} width="80%" />
      </Box>
      <Box width="100%">
        <Skeleton height={8} width="90%" />
        <Skeleton height={8} width="90%" />
      </Box>
    </Box>
)

const ProfileContactSkelton = () => {
  const classes = useStyles();
  return (
    <Box pl={{xs: 2, sm: 0}} height="auto" display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" width={135}>
      <Skeleton variant="rect" className={classes.mb1} width={130} height={36} />
      <Skeleton variant="rect" width={130} height={36} />
    </Box>
  )
}

const ProfileSkelton = ({width}) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Box display="flex" flexWrap={{xs: "wrap", "sm" : "nowrap"}}>
          <Box>
            <PhotosSkelton />
          </Box>
          <Box flexGrow={1} >
            <ProfileNameSkelton />
            { isWidthUp('sm', width) ? <ProfileInfoSkelton /> : <ProfileContactSkelton /> }
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" pt={{xs: 1, sm: 0}} width={{xs: "100%", sm: "auto"}}>
          {isWidthDown('xs', width) ? <ProfileInfoSkelton /> : <ProfileContactSkelton />}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.profileActions}>
          <Skeleton className="action-btn" variant="circle" width={24} height={24} />
          <Skeleton className="action-btn" variant="circle" width={24} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default withWidth()(ProfileSkelton);