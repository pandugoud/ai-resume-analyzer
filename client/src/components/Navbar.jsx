// const Navbar = () => {
//   return (
//     <header className="topbar">
//       <div className="brand-wrap">
//         <div className="brand-logo">RA</div>
//         <div>
//           <h1 className="brand-title">ResumeAI Pro</h1>
//           <p className="brand-subtitle">AI-based resume analyzer & job matching platform</p>
//         </div>
//       </div>

//       <div className="topbar-actions">
//         <button className="ghost-btn">Analytics</button>
//         <button className="primary-btn small">Upload Resume</button>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


const Navbar = ({ user, onLogout }) => {
  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-logo">RA</div>
        <div>
          <h1 className="brand-title">ResumeAI Pro</h1>
          <p className="brand-subtitle">Smart resume analysis dashboard</p>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="user-chip">
          <span>{user?.name}</span>
          <small>{user?.email}</small>
        </div>
        <button className="ghost-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navbar;