package tecnm.equipo4.barberoApi.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "turno")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTurno")
    private Long idTurno;

    @NotNull
    @Column(name = "fecha")
    @FutureOrPresent
    private LocalDate fecha;

    @NotNull
    @Column(name = "horaInicio")
    private LocalTime horaInicio;

    @NotNull
    @NotEmpty
    @Column(name = "estado")
    private String estado;

    @NotNull
    @NotEmpty
    @Column(name = "notasCliente")
    private String notasCliente;

    @NotNull
    @NotEmpty
    @Column(name = "sucursal")
    private String sucursal;

    // Relación con Barbero (resuelve el primer error)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idBarbero")
    private Barbero barbero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idServicio")
    private Servicio servicio;

    @OneToOne(mappedBy = "turno", cascade = CascadeType.ALL)
    private Pago pago;
}