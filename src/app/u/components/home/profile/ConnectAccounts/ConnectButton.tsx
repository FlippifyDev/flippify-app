import LoadingSpinner from "@/app/components/LoadingSpinner";
import LayoutSubscriptionWrapper from "@/app/u/components/layout/LayoutSubscriptionWrapper";

interface SubConnectButtonProps {
    text: string;
    custom_class: string;
    loading?: boolean;
    onClick?: () => void;
}


const SubConnectButton: React.FC<SubConnectButtonProps> = ({ text, custom_class, loading, onClick }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`text-sm rounded-lg flex justify-center py-2 px-3 text-white w-[8rem] text-center border-0 transition duration-300 ${custom_class}`}
        >
            {loading ? (
                <LoadingSpinner />
            ) : text }
        </button>
    )
}


interface ConnectButtonProps {
    connected?: boolean;
    loading?: boolean;
    unavailable?: boolean;
    handleConnect?: () => void;
    handleDisconnect?: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
    connected,
    loading,
    unavailable,
    handleConnect,
    handleDisconnect,
}) => {
    const disconnectButtonClass = "bg-red-600 hover:bg-red-500";
    const connectButtonClass = "bg-houseBlue hover:bg-houseHoverBlue";
    const unavailableClass = "bg-gray-300 hover:bg-gray-300 cursor-not-allowed";
    const loadingClass = "bg-gray-500 hover:bg-gray-500 cursor-not-allowed";

    return (
        <div className="flex flex-col gap-5">
            <div className="relative group">
                <LayoutSubscriptionWrapper anySubscriptions={['member', 'admin']}>
                    {loading ? (
                        <SubConnectButton text="Loading..." loading={true} custom_class={loadingClass} />
                    ) : unavailable ? (
                        <div className="relative group">
                            <SubConnectButton text="Connect" custom_class={unavailableClass} />
                            <div className="w-28 absolute pointer-events-none bottom-full mb-1 left-1/2 transform duration-500 -translate-x-1/2 p-2 bg-gray-800 text-white text-center text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                Coming Soon
                            </div>
                        </div>
                    ) : connected ? (
                        <SubConnectButton text="Disconnect" custom_class={disconnectButtonClass} onClick={handleDisconnect} />
                    ) : (
                        <SubConnectButton text="Connect" custom_class={connectButtonClass} onClick={handleConnect} />
                    )}
                </LayoutSubscriptionWrapper>
                <LayoutSubscriptionWrapper requiredSubscriptions={['!member']}>
                    <div className="relative group">
                        <SubConnectButton text="Connect" custom_class={unavailableClass} />
                        <div className="w-28 absolute pointer-events-none bottom-full mb-1 left-1/2 transform duration-500 -translate-x-1/2 p-2 bg-gray-800 text-white text-center text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Subscription Required
                        </div>
                    </div>
                </LayoutSubscriptionWrapper>
            </div>
        </div>
    );
};

export default ConnectButton;



