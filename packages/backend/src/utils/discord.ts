export const sendDiscordNotification = async (messgage: string) => {
    const url = process.env.DISCORD_WEBHOOK_URL;
    if (!url) {
        console.warn('⚠️ DISCORD_WEBHOOK_URL が設定されていません');
        return;
    }

    try {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: messgage }),
        }).catch((err) => {
            console.error('❌ Discord 通知の送信に失敗しました:', err);
        });
    } catch (error) {
        console.error('❌ Discord通知エラー:', error);
    }
};
