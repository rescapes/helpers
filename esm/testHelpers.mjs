import{taskToPromise as e}from"rescape-ramda";const r=r=>expect(e(r)),p=r=>expect(e(r,!0)),m=e=>new Promise((r,p)=>e.map(r).mapError(p));export{r as expectTask,p as expectTaskRejected,m as resultToPromise};
//# sourceMappingURL=testHelpers.mjs.map
