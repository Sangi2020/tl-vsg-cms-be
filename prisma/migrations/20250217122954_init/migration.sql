BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Enquiries] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [message] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Enquiries_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Enquiries_status_df] DEFAULT 'unread',
    CONSTRAINT [Enquiries_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CompanyInfo] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [address] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CompanyInfo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [CompanyInfo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Newsletter] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Newsletter_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [unSubscribeToken] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Newsletter_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Newsletter_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Newsletter_unSubscribeToken_key] UNIQUE NONCLUSTERED ([unSubscribeToken])
);

-- CreateTable
CREATE TABLE [dbo].[Client] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [logo] NVARCHAR(1000) NOT NULL,
    [website] NVARCHAR(1000),
    [description] TEXT,
    [isActive] BIT NOT NULL CONSTRAINT [Client_isActive_df] DEFAULT 1,
    [order] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Client_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Client_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CompanySettings] (
    [id] NVARCHAR(1000) NOT NULL,
    [logo] NVARCHAR(1000),
    [location] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [mapUrl] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CompanySettings_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [CompanySettings_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [CompanySettings_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [CompanySettings_phone_key] UNIQUE NONCLUSTERED ([phone])
);

-- CreateTable
CREATE TABLE [dbo].[Blog] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [author] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [excerpt] TEXT NOT NULL,
    [content] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Blog_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Blog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Testimonial] (
    [id] NVARCHAR(1000) NOT NULL,
    [text] TEXT NOT NULL,
    [author] NVARCHAR(1000) NOT NULL,
    [position] NVARCHAR(1000) NOT NULL,
    [rating] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Testimonial_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Testimonial_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Catalogue] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] TEXT NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [file] NVARCHAR(1000),
    [category] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [Catalogue_isActive_df] DEFAULT 1,
    [order] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Catalogue_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Catalogue_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Documents] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Documents_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Documents_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Documents_type_key] UNIQUE NONCLUSTERED ([type])
);

-- CreateTable
CREATE TABLE [dbo].[EmailConfig] (
    [id] INT NOT NULL IDENTITY(1,1),
    [host] NVARCHAR(1000) NOT NULL,
    [port] INT NOT NULL,
    [secure] BIT NOT NULL,
    [authUser] NVARCHAR(1000) NOT NULL,
    [authPass] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EmailConfig_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[GoogleAnalytics] (
    [id] NVARCHAR(1000) NOT NULL,
    [trackingId] NVARCHAR(1000) NOT NULL,
    [propertyId] NVARCHAR(1000) NOT NULL,
    [viewId] NVARCHAR(1000),
    [apiKey] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [GoogleAnalytics_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [GoogleAnalytics_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [GoogleAnalytics_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Notification] (
    [id] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    [isRead] BIT NOT NULL CONSTRAINT [Notification_isRead_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Notification_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Notification_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[FAQ] (
    [id] NVARCHAR(1000) NOT NULL,
    [question] TEXT NOT NULL,
    [answer] TEXT NOT NULL,
    [order] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [FAQ_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [FAQ_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PrivacyPolicy] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [content] TEXT NOT NULL,
    [order] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [PrivacyPolicy_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PrivacyPolicy_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[seo] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [seo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [pageTitle] VARCHAR(100) NOT NULL,
    [title] VARCHAR(60) NOT NULL,
    [description] VARCHAR(160) NOT NULL,
    [keywords] VARCHAR(200),
    [ogTitle] VARCHAR(95),
    [ogDescription] VARCHAR(200),
    [ogImage] TEXT,
    [ogType] VARCHAR(50),
    [twitterCard] VARCHAR(20),
    [twitterTitle] VARCHAR(70),
    [twitterDescription] VARCHAR(200),
    [twitterImage] TEXT,
    CONSTRAINT [seo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [seo_pageTitle_key] UNIQUE NONCLUSTERED ([pageTitle])
);

-- CreateTable
CREATE TABLE [dbo].[Social] (
    [id] NVARCHAR(1000) NOT NULL,
    [platform] NVARCHAR(1000),
    [url] NVARCHAR(1000) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Social_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Social_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Social_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Team] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [position] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [bio] TEXT NOT NULL,
    [linkedin] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [isActive] BIT NOT NULL CONSTRAINT [Team_isActive_df] DEFAULT 1,
    [order] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Team_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Team_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'admin',
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Otp] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [otp] NVARCHAR(1000) NOT NULL,
    [isVerified] BIT NOT NULL CONSTRAINT [Otp_isVerified_df] DEFAULT 0,
    [expiresAt] DATETIME2 NOT NULL,
    CONSTRAINT [Otp_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Otp_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Enquiries_email_idx] ON [dbo].[Enquiries]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Enquiries_status_idx] ON [dbo].[Enquiries]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Enquiries_createdAt_idx] ON [dbo].[Enquiries]([createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Blog_date_idx] ON [dbo].[Blog]([date]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Blog_author_idx] ON [dbo].[Blog]([author]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Blog_createdAt_idx] ON [dbo].[Blog]([createdAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Catalogue_category_idx] ON [dbo].[Catalogue]([category]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Catalogue_isActive_idx] ON [dbo].[Catalogue]([isActive]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Catalogue_order_idx] ON [dbo].[Catalogue]([order]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [seo_pageTitle_idx] ON [dbo].[seo]([pageTitle]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Team_isActive_idx] ON [dbo].[Team]([isActive]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Team_order_idx] ON [dbo].[Team]([order]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Team_email_idx] ON [dbo].[Team]([email]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Otp_email_idx] ON [dbo].[Otp]([email]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
