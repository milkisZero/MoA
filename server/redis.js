const redis = require('redis');
const { Club } = require('./model/Club');
const redisClient = redis.createClient({
    url: `[REDIS_URL]`,
});

redisClient.on('connect', () => {
    console.info('Redis connected!');
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    await redisClient.connect();
    await redisClient.del('clubs:sorted:members');
    await redisClient.del('totalClubNumber');

    const club = await Club.aggregate([
        { $addFields: { memberCount: { $size: '$members' } } },
        { $sort: { memberCount: -1, createdAt: 1 } },
    ]);

    const INF = 1e18;
    const multi = redisClient.multi();
    club.forEach((item) => {
        const value = JSON.stringify(item); // 객체를 문자열로 변환
        const score = item.memberCount * INF - item.createdAt.getTime(); // 멤버 수를 점수로 사용
        multi.zAdd('clubs:sorted:members', { score, value });

        console.log(item.name, item.memberCount, item.createdAt.getTime());
    });
    await multi.exec();

    redisClient.set('totalClubNumber', club.length);
})();

module.exports = redisClient;
