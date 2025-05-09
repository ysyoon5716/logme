import { createClient } from '@supabase/supabase-js'

const DATABASE_NAME = 'logme';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const logInput = document.getElementById('logInput');
const createLogButton = document.getElementById('logButton');


async function createLog() {
    const log = logInput.value;
    const { data, error } = await supabase
        .from(DATABASE_NAME)
        .insert({ message: log })
    getLogs();
    logInput.value = '';
}

async function getLogs() {
    const today = new Date();
    const startCreatedAt = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endCreatedAt = new Date(today.setHours(23, 59, 59, 999)).toISOString();
    const { data, error } = await supabase
        .from(DATABASE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
        .gte('created_at', startCreatedAt)
        .lte('created_at', endCreatedAt)
    console.log(data);

    const logsContainer = document.getElementById('logsContainer');
    logsContainer.innerHTML = '';
    data.forEach(log => {
        const time = new Date(log.created_at).toISOString().split('.')[0].replace('T', ' ');
        const logMessageComponent = document.createElement('div');
        logMessageComponent.innerHTML = `
            <div class="bg-white rounded-lg mt-4">
                <p class="text-sm text-gray-500">${time}</p>
                <p>${log.message}</p>
            </div>
        `;
        logsContainer.appendChild(logMessageComponent);
    });
}

getLogs();

createLogButton.addEventListener('click', createLog);
logInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && logInput.value.trim() !== '') {
        createLog();
    }
});
