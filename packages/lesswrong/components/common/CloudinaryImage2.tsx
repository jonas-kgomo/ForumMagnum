import { registerComponent } from '../../lib/vulcan-lib';
import React from 'react';
import { cloudinaryCloudNameSetting } from '../../lib/publicSettings';

function cloudinaryPropsToStr(props) {
  let sb: string[] = [];
  for(let k in props)
    sb.push(`${k}_${props[k]}`);
  return sb.join(",");
}

// Cloudinary image without using cloudinary-react. Allows SSR. See:
// https://github.com/LessWrong2/Lesswrong2/pull/937 "Drop cloudinary react"
// https://github.com/LessWrong2/Lesswrong2/pull/964 "Temporarily revert removal of cloudinary-react"
const CloudinaryImage2 = ({width, height, objectFit, publicId, className}: {
  width?: number,
  height?: number,
  objectFit?: string,
  publicId: string,
  className?: string,
}) => {
  const cloudinaryCloudName = cloudinaryCloudNameSetting.get()

  let cloudinaryProps: any = {
    c: "fill",
    dpr: "auto",
    g: "custom",
    q: "auto",
  };
  let imageStyle: any = {};

  if (width) {
    cloudinaryProps.w = width
    imageStyle.width = width
  }
  if (height) {
    cloudinaryProps.h = height;
    imageStyle.height = height+"px";
  }
  if (objectFit) {
    imageStyle.objectFit = objectFit
  }

  const imageUrl = `https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/${cloudinaryPropsToStr(cloudinaryProps)}/${publicId}`;

  return <img
    src={imageUrl}
    style={imageStyle}
    className={className}
  />
};

const CloudinaryImage2Component = registerComponent('CloudinaryImage2', CloudinaryImage2);

declare global {
  interface ComponentTypes {
    CloudinaryImage2: typeof CloudinaryImage2Component
  }
}
