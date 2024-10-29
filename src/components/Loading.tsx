const Loading = () => {
  return (
    <div className="h-screen w-full bg-zinc-900">
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FE8888] border-t-transparent" />
      </div>
    </div>
  )
}

export default Loading
