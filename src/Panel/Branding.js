const Branding = () => {
    return <div class="flex h-3 py-4 px-2 bg-red-400 h-32">
        <img src='/logo.png' alt="Logo" class="w-24 h-32" />
        <div class="flex-1 h-32 ml-4">
            <div className="text-white text-2xl font-bold">brand</div>
            <div className="text-gray-200">slogan</div>
        </div>
    </div>
};

export default Branding;