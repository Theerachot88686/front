function App() {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold underline text-center border py-5 m-5 relative top-5">
        Hello world! ธีรโชติ เหล่าเทพ
      </h1>
      <input type="checkbox" value="dark" className="toggle theme-controller " />
      <div className="flex gap-3 justify-center py-5">
        <button className="btn">Button</button>
        <button className="btn btn-neutral">Neutral</button>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-ghost">Ghost</button>
        <button className="btn btn-link">Link</button>
      </div>
      
    </div>
  );
}

export default App;
