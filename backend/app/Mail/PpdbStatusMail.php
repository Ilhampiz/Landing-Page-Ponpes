<?php

namespace App\Mail;

use App\Models\PpdbRegistration;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PpdbStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $ppdb;

    /**
     * Create a new message instance.
     */
    public function __construct(PpdbRegistration $ppdb)
    {
        $this->ppdb = $ppdb;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $statusStr = ucfirst($this->ppdb->status);
        if ($this->ppdb->status === 'pending') {
            $subject = 'Pendaftaran PPDB Berhasil - Status: Pending';
        } else {
            $subject = 'Pembaruan Status Pendaftaran PPDB: ' . $statusStr;
        }

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ppdb_status',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
