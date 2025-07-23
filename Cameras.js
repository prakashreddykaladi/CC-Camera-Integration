// =============================================================================
// App: SecureSight Dashboard
// =============================================================================
// This is a complete Next.js 15 application built with the App Router.
// It now features fully operational views for all navigation items, including
// a live camera feed integration on the 'Cameras' page.
// All code, including components, mock API, and styles, is in this single file.
// =============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
// In a real Next.js app, you would install these with npm/yarn
// For this example, we'll use inline SVGs for icons.

// =============================================================================
// Icon Components (Using inline SVG for portability)
// =============================================================================

const ShieldAlert = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path>
  </svg>
);

const Video = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const LayoutDashboard = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>
    </svg>
);

const Target = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
    </svg>
);

const UserCheck = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline>
    </svg>
);

const GunIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.5 14.5L18 12l-6-6-2.5 2.5L12 11l-2 2-2.5-2.5L2 16.5l6 6 6-6-2-2 2.5-2.5Z"/>
        <path d="m13.5 6.5 4 4"/>
    </svg>
);

// =============================================================================
// Mock Data & API
// =============================================================================

const CAMERAS = [
    { id: 1, name: 'Camera-01', location: 'Shop Floor A', liveImage: 'https://images.unsplash.com/photo-1590523743842-ab27c6535aa4?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Camera-02', location: 'Vault', liveImage: 'https://images.unsplash.com/photo-1556742044-1a634cee3623?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, name: 'Camera-03', location: 'Main Entrance', liveImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0b343?q=80&w=1935&auto=format&fit=crop' },
];

let incidents = [
    { id: 1, cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-23T14:35:12Z', tsEnd: '2025-07-23T14:37:20Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Unauthorised+Access', resolved: false },
    { id: 2, cameraId: 2, type: 'Gun Threat', tsStart: '2025-07-23T14:30:05Z', tsEnd: '2025-07-23T14:31:00Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Gun+Threat', resolved: false },
    { id: 3, cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-23T12:15:45Z', tsEnd: '2025-07-23T12:16:30Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Unauthorised+Access', resolved: false },
    { id: 4, cameraId: 3, type: 'Face Recognised', tsStart: '2025-07-23T11:05:10Z', tsEnd: '2025-07-23T11:05:15Z', thumbnailUrl: 'https://placehold.co/800x450/357abd/ffffff?text=Face+Recognised', resolved: false },
    { id: 5, cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-23T09:50:00Z', tsEnd: '2025-07-23T09:52:18Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Unauthorised+Access', resolved: false },
    { id: 6, cameraId: 2, type: 'Unauthorised Access', tsStart: '2025-07-23T08:22:30Z', tsEnd: '2025-07-23T08:24:00Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Unauthorised+Access', resolved: false },
    { id: 7, cameraId: 3, type: 'Gun Threat', tsStart: '2025-07-22T22:10:00Z', tsEnd: '2025-07-22T22:11:45Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Gun+Threat', resolved: false },
    { id: 8, cameraId: 1, type: 'Face Recognised', tsStart: '2025-07-22T20:45:00Z', tsEnd: '2025-07-22T20:45:05Z', thumbnailUrl: 'https://placehold.co/800x450/357abd/ffffff?text=Face+Recognised', resolved: true },
    { id: 9, cameraId: 2, type: 'Unauthorised Access', tsStart: '2025-07-22T18:00:00Z', tsEnd: '2025-07-22T18:05:22Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Unauthorised+Access', resolved: false },
    { id: 10, cameraId: 3, type: 'Traffic Congestion', tsStart: '2025-07-22T17:30:00Z', tsEnd: '2025-07-22T17:45:00Z', thumbnailUrl: 'https://placehold.co/800x450/f0ad4e/ffffff?text=Traffic+Congestion', resolved: true },
    { id: 11, cameraId: 1, type: 'Unauthorised Access', tsStart: '2025-07-22T15:12:00Z', tsEnd: '2025-07-22T15:13:15Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Unauthorised+Access', resolved: false },
    { id: 12, cameraId: 3, type: 'Gun Threat', tsStart: '2025-07-22T14:59:00Z', tsEnd: '2025-07-22T14:59:55Z', thumbnailUrl: 'https://placehold.co/800x450/c9302c/ffffff?text=Gun+Threat', resolved: false },
];

const USERS_DATA = [
    { id: 1, name: 'Mohammed Ajhas', email: 'ajhas@mandlacx.com', role: 'Administrator', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@securesight.io', role: 'Operator', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 3, name: 'John Smith', email: 'john.smith@securesight.io', role: 'Operator', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 4, name: 'Emily White', email: 'emily.white@securesight.io', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

const api = {
    getIncidents: async (resolved) => {
        await new Promise(res => setTimeout(res, 500));
        const allIncidents = incidents.map(incident => ({ ...incident, camera: CAMERAS.find(c => c.id === incident.cameraId) }));
        if (resolved === undefined) return allIncidents.sort((a, b) => new Date(b.tsStart) - new Date(a.tsStart));
        const isResolved = resolved === 'true';
        return allIncidents.filter(inc => inc.resolved === isResolved).sort((a, b) => new Date(b.tsStart) - new Date(a.tsStart));
    },
    resolveIncident: async (id) => {
        await new Promise(res => setTimeout(res, 1000));
        const incidentIndex = incidents.findIndex(inc => inc.id === id);
        if (incidentIndex !== -1) {
            incidents[incidentIndex].resolved = true;
            return { ...incidents[incidentIndex], camera: CAMERAS.find(c => c.id === incidents[incidentIndex].cameraId) };
        }
        throw new Error('Incident not found');
    },
};

// =============================================================================
// Helper Components & Functions
// =============================================================================

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
const formatDateTime = (dateString) => `${formatDate(dateString)}, ${formatTime(dateString)}`;

const IncidentTypeIcon = ({ type }) => {
    const config = useMemo(() => {
        switch (type) {
            case 'Unauthorised Access': return { Icon: ShieldAlert, color: 'text-yellow-400' };
            case 'Gun Threat': return { Icon: GunIcon, color: 'text-red-500' };
            case 'Face Recognised': return { Icon: UserCheck, color: 'text-blue-400' };
            default: return { Icon: ShieldAlert, color: 'text-gray-400' };
        }
    }, [type]);
    return <config.Icon className={`h-5 w-5 ${config.color}`} />;
};

// =============================================================================
// Main Application Components
// =============================================================================

const Header = ({ activePage, onNavigate }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Cameras', icon: Video },
        { name: 'Scenes', icon: Target },
        { name: 'Incidents', icon: ShieldAlert },
        { name: 'Users', icon: Users },
    ];
    return (
        <header className="bg-[#1a202c] border-b border-gray-700 sticky top-0 z-50">
            <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0 text-white font-bold text-lg">SECURESIGHT</div>
                        <nav className="hidden md:flex md:space-x-4">
                            {navItems.map(item => (
                                <button key={item.name} onClick={() => onNavigate(item.name)} className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.name === activePage ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <img className="h-9 w-9 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                        </div>
                        <div className="ml-3 text-right">
                            <p className="text-sm font-medium text-white">Mohammed Ajhas</p>
                            <p className="text-xs text-gray-400">ajhas@mandlacx.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

const IncidentPlayer = ({ selectedIncident, allCameras }) => {
    const mainCamera = selectedIncident ? selectedIncident.camera : allCameras[0];
    const otherCameras = allCameras.filter(c => c.id !== mainCamera?.id);
    const displayImage = selectedIncident ? selectedIncident.thumbnailUrl : mainCamera?.liveImage;

    return (
        <div className="flex flex-col h-full bg-[#1a202c] rounded-lg overflow-hidden">
            <div className="relative flex-grow aspect-video bg-black">
                {displayImage ? <img src={displayImage} alt={selectedIncident ? selectedIncident.type : "Live feed"} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><p className="text-gray-500">No Camera Feed</p></div>}
                <div className="absolute bottom-0 left-0 p-4 bg-black/50 rounded-tr-lg"><p className="text-white font-semibold">{mainCamera?.name || 'N/A'}</p></div>
                <div className="absolute top-4 left-4 p-2 bg-black/50 rounded-lg"><p className="text-white text-sm">{selectedIncident ? `${formatDate(selectedIncident.tsStart)} - ${formatTime(selectedIncident.tsStart)}` : 'Live Feed'}</p></div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-2 p-2 bg-gray-900/50">
                {otherCameras.map(cam => (
                    <div key={cam.id} className="relative aspect-video rounded overflow-hidden group">
                        <img src={cam.liveImage} alt={`Live feed from ${cam.name}`} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 left-1 px-2 py-1 bg-black/50 rounded"><p className="text-white text-xs">{cam.name}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const IncidentList = ({ incidents, resolvedCount, onResolve, onSelect, selectedId, isLoading }) => (
    <div className="bg-[#1a202c] rounded-lg p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white"><span className="text-red-500">{incidents.length}</span> Unresolved Incidents</h2>
            <span className="text-sm text-gray-400">{resolvedCount} resolved incidents</span>
        </div>
        {isLoading ? <div className="flex-grow flex items-center justify-center"><p className="text-gray-400">Loading incidents...</p></div> : (
            <ul className="space-y-3 overflow-y-auto flex-grow pr-2">
                {incidents.map(incident => (
                    <li key={incident.id} onClick={() => onSelect(incident)} className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 cursor-pointer ${selectedId === incident.id ? 'bg-blue-900/60 ring-2 ring-blue-500' : 'bg-gray-800/50 hover:bg-gray-700/70'}`}>
                        <img src={incident.thumbnailUrl} alt={incident.type} className="w-24 h-14 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-grow"><div className="flex items-center space-x-2"><IncidentTypeIcon type={incident.type} /><p className="font-semibold text-white">{incident.type}</p></div><p className="text-sm text-gray-400">{incident.camera.location}</p><p className="text-xs text-gray-500">{`${formatTime(incident.tsStart)} - ${formatTime(incident.tsEnd)} on ${formatDate(incident.tsStart)}`}</p></div>
                        <button onClick={(e) => { e.stopPropagation(); onResolve(incident.id); }} className="text-sm text-blue-400 hover:text-blue-300 hover:underline pr-2 flex-shrink-0">Resolve &gt;</button>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

// -----------------------------------------------------------------------------
// Component: DashboardView
// -----------------------------------------------------------------------------
const DashboardView = () => {
    const [unresolvedIncidents, setUnresolvedIncidents] = useState([]);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [optimisticResolving, setOptimisticResolving] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            const unresolved = await api.getIncidents('false');
            const resolved = await api.getIncidents('true');
            setUnresolvedIncidents(unresolved);
            setResolvedCount(resolved.length);
            if (unresolved.length > 0) setSelectedIncident(unresolved[0]);
            setIsLoading(false);
        };
        fetchInitialData();
    }, []);

    const handleResolve = (incidentId) => {
        setOptimisticResolving(prev => [...prev, incidentId]);
        if (selectedIncident && selectedIncident.id === incidentId) {
            const currentIndex = unresolvedIncidents.findIndex(inc => inc.id === incidentId);
            const nextIncident = unresolvedIncidents[currentIndex + 1] || unresolvedIncidents[currentIndex - 1] || null;
            setSelectedIncident(nextIncident);
        }
        setTimeout(() => {
            setUnresolvedIncidents(prev => prev.filter(inc => inc.id !== incidentId));
            setResolvedCount(prev => prev + 1);
            api.resolveIncident(incidentId)
                .then(updatedIncident => console.log('Successfully resolved incident:', updatedIncident))
                .catch(error => console.error('Failed to resolve incident:', error))
                .finally(() => setOptimisticResolving(prev => prev.filter(id => id !== incidentId)));
        }, 500);
    };

    const displayIncidents = unresolvedIncidents.filter(inc => !optimisticResolving.includes(inc.id));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-104px)]">
            <div className="lg:col-span-2"><IncidentPlayer selectedIncident={selectedIncident} allCameras={CAMERAS} /></div>
            <div className="lg:col-span-1"><IncidentList incidents={displayIncidents} resolvedCount={resolvedCount} onResolve={handleResolve} onSelect={setSelectedIncident} selectedId={selectedIncident?.id} isLoading={isLoading} /></div>
        </div>
    );
};

// -----------------------------------------------------------------------------
// Component: CameraFeed (NEW)
// -----------------------------------------------------------------------------
const CameraFeed = ({ camera, isLive }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLive) return;

        let stream;
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } else {
                    throw new Error('getUserMedia not supported');
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError(err.message || "Could not access the camera.");
            }
        };

        startCamera();

        return () => {
            // Cleanup: stop the stream when the component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isLive]);

    return (
        <div className="bg-[#1a202c] rounded-lg overflow-hidden shadow-lg">
            <div className="relative w-full h-48 bg-black">
                {isLive ? (
                    error ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                            <p className="text-red-400 font-semibold">Camera Error</p>
                            <p className="text-xs text-gray-400">{error}</p>
                        </div>
                    ) : (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                    )
                ) : (
                    <img src={camera.liveImage} alt={`Feed from ${camera.name}`} className="w-full h-full object-cover" />
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{camera.name}</h3>
                <p className="text-gray-400">{camera.location}</p>
            </div>
        </div>
    );
};


// -----------------------------------------------------------------------------
// Component: CamerasView (UPDATED)
// -----------------------------------------------------------------------------
const CamerasView = ({ isLive }) => (
    <div>
        <h1 className="text-2xl font-bold text-white mb-6">Camera Feeds</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMERAS.map(camera => (
                <CameraFeed key={camera.id} camera={camera} isLive={isLive} />
            ))}
        </div>
    </div>
);

// -----------------------------------------------------------------------------
// Component: IncidentsView
// -----------------------------------------------------------------------------
const IncidentsView = () => {
    const [allIncidents, setAllIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showResolved, setShowResolved] = useState(false);

    useEffect(() => {
        const fetchAllIncidents = async () => {
            setIsLoading(true);
            const data = await api.getIncidents(); // Get all incidents
            setAllIncidents(data);
            setIsLoading(false);
        };
        fetchAllIncidents();
    }, []);
    
    const filteredIncidents = allIncidents.filter(inc => inc.resolved === showResolved);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Incident History</h1>
                <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
                    <button onClick={() => setShowResolved(false)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${!showResolved ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Unresolved</button>
                    <button onClick={() => setShowResolved(true)} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${showResolved ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Resolved</button>
                </div>
            </div>
             {isLoading ? <p className="text-gray-400">Loading incident history...</p> : (
                <div className="bg-[#1a202c] rounded-lg shadow-lg">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-300">Type</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Camera</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Start Time</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">End Time</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIncidents.map(incident => (
                                <tr key={incident.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4"><div className="flex items-center gap-2"><IncidentTypeIcon type={incident.type} /> {incident.type}</div></td>
                                    <td className="p-4">{incident.camera.name} ({incident.camera.location})</td>
                                    <td className="p-4 text-gray-400">{formatDateTime(incident.tsStart)}</td>
                                    <td className="p-4 text-gray-400">{formatDateTime(incident.tsEnd)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${incident.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {incident.resolved ? 'Resolved' : 'Unresolved'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             )}
        </div>
    );
};

// -----------------------------------------------------------------------------
// Component: UsersView
// -----------------------------------------------------------------------------
const UsersView = () => (
    <div>
        <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
        <div className="bg-[#1a202c] rounded-lg shadow-lg overflow-hidden">
            <ul className="divide-y divide-gray-700">
                {USERS_DATA.map(user => (
                    <li key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-800/50">
                        <div className="flex items-center space-x-4">
                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-white">{user.name}</p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-700 text-gray-300">{user.role}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

// -----------------------------------------------------------------------------
// Component: ScenesView
// -----------------------------------------------------------------------------
const ScenesView = () => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Scene Configuration</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Define New Scene</button>
        </div>
        <div className="bg-[#1a202c] rounded-lg shadow-lg p-4">
            <p className="text-gray-400 mb-4">Select a camera and draw regions to monitor for specific activities (e.g., tripwires, intrusion zones).</p>
            <div className="relative aspect-video bg-black rounded-lg">
                <img src={CAMERAS[0].liveImage} alt="Camera feed for scene definition" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 border-4 border-dashed border-blue-500/50 rounded-lg flex items-center justify-center">
                    <p className="text-white bg-black/50 px-4 py-2 rounded-lg">Scene definition area</p>
                </div>
            </div>
        </div>
    </div>
);


// =============================================================================
// Default App Export
// =============================================================================
// This is the main component that renders the correct view based on navigation.
export default function App() {
    const [activePage, setActivePage] = useState('Dashboard');

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard': return <DashboardView />;
            case 'Cameras': return <CamerasView isLive={true} />;
            case 'Scenes': return <ScenesView />;
            case 'Incidents': return <IncidentsView />;
            case 'Users': return <UsersView />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="bg-[#0f172a] text-gray-300 min-h-screen">
            <Header activePage={activePage} onNavigate={setActivePage} />
            <main className="mx-auto max-w-[1920px] p-4">
                {renderPage()}
            </main>
        </div>
    );
}
