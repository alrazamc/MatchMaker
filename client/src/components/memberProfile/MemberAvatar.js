import React, { useMemo } from 'react';
import { Avatar } from '@material-ui/core';
import MaleAvatar from '../../assets/images/male-avatar.jpg';
import FemaleAvatar from '../../assets/images/female-avatar.jpg';
 
const getProfilePic = (photos) => {
  const images = photos && photos.images && photos.images.length ? photos.images : [];
  if(images.length)
  {
    let ProfilePicIndex = photos.profilePictureIndex ? photos.profilePictureIndex : 0;
    return images[ProfilePicIndex] ? images[ProfilePicIndex] : images[0];
  }
  return null;
}

const MemberAvatar = ({photos, gender, size=40 }) => {
  let src = null;
  let profilePic = useMemo(() => getProfilePic(photos), [photos]);
  if(profilePic)
    src = profilePic.thumbUrl ? profilePic.thumbUrl : profilePic.imageUrl;
  else if(!gender || gender === 1)
    src = MaleAvatar;
  else if(gender === 2)
    src = FemaleAvatar;
  return (
    <Avatar imgProps={{ crossOrigin: 'anonymous' }} style={{ width: size, height: size }} alt="Profile Pic" src={src} />
  );
}

export default  MemberAvatar;