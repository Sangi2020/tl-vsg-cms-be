import fetchReport from "../helpers/analytics.js";
import prisma from "../helpers/prisma.js";


// Helper function to handle date range from request or default
const getDateRange = (req) => {
    const { startDate, endDate } = req.query;
    return {
        startDate: startDate || '30daysAgo',
        endDate: endDate || 'today',
    };
};

export const countryAnalytics = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'totalUsers' }],
            [{ name: 'country' }],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No data found for country analytics.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching country analytics data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch country analytics data.'
        });
    }
};

export const activeUsers = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'activeUsers' }],
            [],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No active users data found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching active users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch active users.' 
        });
    }
};

export const engagedSessions = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'engagedSessions' }],
            [],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No engaged sessions data found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching engaged sessions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch engaged sessions.' 
        });
    }
};

export const cityStats = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'activeUsers' }],
            [{ name: 'city' }],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No city statistics found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching city stats:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch city-wise stats.' 
        });
    }
};

export const totalPageViews = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'screenPageViews' }],
            [],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No page view data found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching page views:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch total page views.' 
        });
    }
};

export const bounceRate = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'bounceRate' }],
            [],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No bounce rate data found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching bounce rate:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bounce rate.' 
        });
    }
};

export const pageViewsByPage = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [{ name: 'screenPageViews' }], // Changed to array for consistency
            [{ name: 'pagePath' }],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No page-wise view data found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching page views by page:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch page views by page.' 
        });
    }
};

export const fullPageData = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [
                { name: 'screenPageViews' },
                { name: 'sessions' },
                { name: 'activeUsers' },
                { name: 'eventCount' },
                { name: 'engagementRate' },
            ],
            [
                { name: 'pagePath' },
                { name: 'pageTitle' },
            ],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No full page data found.' 
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching full page data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch full page data.' 
        });
    }
};

export const trafficSources = async (req, res) => {
    try {
        const dateRange = getDateRange(req);
        const result = await fetchReport(
            [
                { name: 'sessions' },
                { name: 'totalUsers' }
            ],
            [
                { name: 'sessionDefaultChannelGroup' }  // GA4's default channel grouping
            ],
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No traffic sources data found.' 
            });
        }

        // Process data for all main traffic channels
        const processedData = result.map(item => ({
            channel: item.sessionDefaultChannelGroup,
            sessions: parseInt(item.sessions),
            users: parseInt(item.totalUsers)
        })).filter(item => 
            // Include all major traffic channels
            [
                'Organic Search',
                'Paid Search', 
                'Direct',
                'Referral',
                'Social',
                'Email',
                'Display',
                'Affiliates'
            ].includes(item.channel)
        );

        // Calculate total sessions for percentage
        const totalSessions = processedData.reduce((sum, item) => sum + item.sessions, 0);

        // Add percentage to each channel
        const finalData = processedData.map(item => ({
            ...item,
            percentage: ((item.sessions / totalSessions) * 100).toFixed(1)
        }));

        // Sort by number of sessions descending
        finalData.sort((a, b) => b.sessions - a.sessions);

        res.json({ 
            success: true, 
            data: finalData,
            summary: {
                totalSessions,
                totalUsers: finalData.reduce((sum, item) => sum + item.users, 0)
            }
        });
    } catch (error) {
        console.error('Error fetching traffic sources data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch traffic sources data.' 
        });
    }
};

export const sessionDurationDistribution = async (req, res) => {
    try {
        const dateRange = getDateRange(req);

        // Fetch session duration data
        const result = await fetchReport(
            [{ name: 'averageSessionDuration' }], // GA4 metric for session duration
            [{ name: 'sessionSourceMedium' }],   // Optional dimension for grouping by source
            dateRange
        );

        if (!result?.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'No session duration data found.' 
            });
        }

        // Format the data for the frontend
        const formattedData = result.map(item => ({
            source: item.sessionSourceMedium || 'Unknown',
            avgSessionDuration: parseFloat(item.averageSessionDuration).toFixed(2) // Average duration in seconds
        }));

        // Sort by session duration descending
        formattedData.sort((a, b) => b.avgSessionDuration - a.avgSessionDuration);

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error('Error fetching session duration data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch session duration data.' 
        });
    }
};




//
export const totalEnquiries = async (req, res) => {
    try {
        const totalEnquiries = await prisma.enquiries.count();

        return res.status(200).json({
            success: true,
            data: totalEnquiries,
        });
    } catch (error) {
        console.error("Error fetching total enquiries:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const totalNewsletterSubscribers = async (req, res) => {
    try {
        const totalSubscribers = await prisma.newsletter.count();

        return res.status(200).json({
            success: true,
            data: totalSubscribers,
        });
    } catch (error) {
        console.error("Error fetching total newsletter subscribers:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const totalBlogs = async (req, res) => {
    try {
      const totalBlogs = await prisma.blog.count();
  
      return res.status(200).json({
        success: true,
        data: totalBlogs,
      });
    } catch (error) {
      console.error("Error fetching total blog count:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  };



  export const enquiryStats = async (req, res) => {
    try {
      // Get the current date and calculate 7 days ago
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
  
      // Fetch enquiries created in the last 7 days
      const enquiries = await prisma.enquiries.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });
  
      const groupedData = {};
      enquiries.forEach((enquiry) => {
        const date = enquiry.createdAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        groupedData[date] = (groupedData[date] || 0) + 1;
      });
  
      // Create chart-compatible data
      const chartData = [["Date", "Enquiries"]];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0];
        chartData.push([formattedDate, groupedData[formattedDate] || 0]);
      }
  
      res.json(chartData.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }


  export const totalCounts = async (req, res) => {
    try {
        const [
          totalClients,
          activeClients,
          totalBlogs,
          totalTestimonials,
          totalCatalogues,
          activeCatalogues,
          unreadEnquiries,
          totalEnquiries,
          totalNewsletterSubscribers,
          unreadNotifications,
          activeSocialLinks,
          activeTeamMembers
        ] = await Promise.all([
          // Clients
          prisma.client.count(),
          prisma.client.count({
            where: { isActive: true }
          }),
    
          // Blogs
          prisma.blog.count(),
    
          // Testimonials
          prisma.testimonial.count(),
    
          // Catalogues
          prisma.catalogue.count(),
          prisma.catalogue.count({
            where: { isActive: true }
          }),
    
          // Enquiries
          prisma.enquiries.count({
            where: { status: "unread" }
          }),
          prisma.enquiries.count(),
    
          // Newsletter Subscribers
          prisma.newsletter.count(),
    
          // Unread Notifications
          prisma.notification.count({
            where: { isRead: false }
          }),
    
          // Active Social Links
          prisma.social.count({
            where: { isActive: true }
          }),
    
          // Active Team Members
          prisma.team.count({
            where: { isActive: true }
          })
        ]);
    
        res.json({
          success: true,
          counts: {
            clients: {
              total: totalClients,
              active: activeClients
            },
            blogs: {
              total: totalBlogs
            },
            testimonials: {
              total: totalTestimonials
            },
            catalogues: {
              total: totalCatalogues,
              active: activeCatalogues
            },
            enquiries: {
              total: totalEnquiries,
              unread: unreadEnquiries
            },
            newsletter: {
              subscribers: totalNewsletterSubscribers
            },
            notifications: {
              unread: unreadNotifications
            },
            social: {
              active: activeSocialLinks
            },
            team: {
              active: activeTeamMembers
            }
          }
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        res.status(500).json({
          success: false,
          error: "Failed to fetch counts"
        });
      }
  }