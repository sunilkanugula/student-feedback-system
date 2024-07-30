// const ThankYou = () => {
//     const location = useLocation();
//     const { averagePercentages } = location.state || {};
  
//     return (
//       <div className='thank-you-container'>
//         <h2>Thank You!</h2>
//         <p>Your feedback has been submitted successfully.</p>
  
//         <div className='percentages-container'>
//           <h3>Subject Percentages:</h3>
//           {averagePercentages && Object.entries(averagePercentages).map(([subject, percentage]) => (
//             !isNaN(percentage) && (
//               <p key={subject}>{subject}: {percentage}%</p>
//             )
//           ))}
//           {averagePercentages && Object.entries(averagePercentages).some(([subject, percentage]) => isNaN(percentage)) && (
//             <p>Please note: Some subjects have incomplete reviews and their percentages are not available.</p>
//           )}
//         </div>
//       </div>
//     );
//   }
  
//   export default ThankYou;
  