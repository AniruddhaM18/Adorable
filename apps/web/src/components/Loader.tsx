"use client";
export default function Loader() {
    return (
      <div className="p-20 flex justify-center items-center">
        <div className="bg-gray-800 w-120 rounded-lg">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl order-2 md:order-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-400" />
                            <div className="flex-1">
                                <div className="text-gray-300 text-sm mb-2">
                                    Planning your Project
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3 text-xs text-gray-400 font-mono">
                                    AI is creating your site,
                                    <br />
                                    hold on... 
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500" />
                            <div className="flex-1">
                                <div className="text-gray-300 text-md">
                                    Your Project is Ready!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div> 
    )
}