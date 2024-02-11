import AppRouter from "./routes/AppRouter";
import useAuth from "./routes/AppRouter";
function App() {
  const {loading} = useAuth ()
  if(loading){
    return(
      <p className="text-4xl text-primay">loading...</p>
    )
  }
  return (
    <div className="min-h-screen">
      <AppRouter/>
    </div>
  );
}

export default App;
