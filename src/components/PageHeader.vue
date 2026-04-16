<template>
    <div class="page-top">
        <div class="page-title-wrap">
            <div class="title-icon">
                <i class="bi bi-emoji-smile"></i>
            </div>

            <div class="title-content">
                <h1 class="page-title">
                    <slot name="title"></slot>
                    <span class="page-subtitle">
                        <slot name="subtitle"></slot>
                    </span>
                </h1>
            </div>
        </div>

        <div class="update-time">
            <slot name="update-time"></slot>
        </div>
    </div>
</template>

<script setup></script>

<style scoped>
.page-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    padding: 0 6px;
}

.page-title-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
}

.title-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #38a169;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.title-content {
    display: flex;
    align-items: center;
    min-width: 0;
}

.page-title {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0;
    font-family: "Hind Siliguri", "Noto Sans TC", sans-serif;
    font-size: 27px;
    font-weight: 500;
    line-height: 35px;
    color: rgb(96, 96, 96);
    white-space: nowrap;
}

.page-subtitle {
    font-family: "Hind Siliguri", "Noto Sans TC", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: rgb(187, 187, 187);
    white-space: nowrap;
}

.update-time {
    flex-shrink: 0;
    font-family: "Hind Siliguri", "Noto Sans TC", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: rgb(113, 113, 113);
    white-space: nowrap;
    margin-left: 20px;
}

/* 平板以下避免擠壓 */
@media (max-width: 1200px) {
    .page-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .update-time {
        margin-left: 0;
    }
}

/* 手機再縮一點 */
@media (max-width: 768px) {
    .page-title {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        font-size: 22px;
        line-height: 30px;
        white-space: normal;
    }

    .page-subtitle {
        white-space: normal;
    }

    .title-icon {
        width: 30px;
        height: 30px;
        font-size: 16px;
    }
}
</style>