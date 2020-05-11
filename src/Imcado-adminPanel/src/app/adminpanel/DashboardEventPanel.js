import React from "react";

export default function DashboardEventPanel({
  lefTopTitle,
  mainTitle,
  fromDate,
  toDate
}) {


  return (
    <div className="kt-widget26">
        <span >{lefTopTitle}</span>
        <span style={{'fontSize':'40px', 'textAlign':'center', 'paddingTop':'20px','paddingBottom':'20px', height:'100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap'}} title={mainTitle}>{mainTitle}</span>
        <div style={{'textAlign':'right', 'height':'19.2px'}}>
          <span>{fromDate} {fromDate !== "" ? ' - ' : ' '} </span>
          <span>{toDate}</span>
        </div>
    </div>
  );
}